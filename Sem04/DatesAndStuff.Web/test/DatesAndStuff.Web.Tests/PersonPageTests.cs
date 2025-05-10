using System;
using System.Diagnostics;
using System.Globalization;
using System.Reflection;
using System.Text;
using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace DatesAndStuff.Web.Tests
{
    [TestFixture]
    public class PersonPageTests
    {
        private IWebDriver driver;
        private StringBuilder verificationErrors;
        private const string BaseURL = "http://localhost:5091";
        private bool acceptNextAlert = true;

        private Process? _blazorProcess;

        [OneTimeSetUp]
        public void StartBlazorServer()
        {
            var webProjectPath = Path.GetFullPath(Path.Combine(
                Assembly.GetExecutingAssembly().Location,
                "../../../../../../src/DatesAndStuff.Web/DatesAndStuff.Web.csproj"
                ));

            var webProjFolderPath = Path.GetDirectoryName(webProjectPath);

            var startInfo = new ProcessStartInfo
            {
                FileName = "dotnet",
                //Arguments = $"run --project \"{webProjectPath}\"",
                Arguments = "dotnet run --no-build",
                WorkingDirectory = webProjFolderPath,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false
            };

            _blazorProcess = Process.Start(startInfo);

            // Wait for the app to become available
            var client = new HttpClient();
            var timeout = TimeSpan.FromSeconds(30);
            var start = DateTime.Now;

            while (DateTime.Now - start < timeout)
            {
                try
                {
                    var result = client.GetAsync(BaseURL).Result;
                    if (result.IsSuccessStatusCode)
                    {
                        break;
                    }
                }
                catch (Exception e)
                {
                    Thread.Sleep(1000);
                }
            }
        }

        [OneTimeTearDown]
        public void StopBlazorServer()
        {
            if (_blazorProcess != null && !_blazorProcess.HasExited)
            {
                _blazorProcess.Kill(true);
                _blazorProcess.Dispose();
            }
        }

        [SetUp]
        public void SetupTest()
        {
            driver = new ChromeDriver();
            verificationErrors = new StringBuilder();
        }

        [TearDown]
        public void TeardownTest()
        {
            try
            {
                driver.Quit();
                driver.Dispose();
            }
            catch (Exception)
            {
                // Ignore errors if unable to close the browser
            }
            Assert.AreEqual("", verificationErrors.ToString());
        }

        [Test]
        [TestCase(-10.00001, 1000)]
        [TestCase(-10, 4500)]
        public void Person_SalaryIncrease_ShouldShowError_WhenPercentageBelowMinusTen(double percentage, double expectedSalary)
        {
            // Arrange
            driver.Navigate().GoToUrl(BaseURL);
            driver.FindElement(By.XPath("//*[@data-test='PersonPageNavigation']")).Click();

            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));
            Thread.Sleep(2000);

            var input = wait.Until(ExpectedConditions.ElementExists(By.XPath("//*[@data-test='SalaryIncreasePercentageInput']")));
            input.Clear();
            input.SendKeys(percentage.ToString(CultureInfo.InvariantCulture));

            // Act
            var submitButton = wait.Until(ExpectedConditions.ElementExists(By.XPath("//*[@data-test='SalaryIncreaseSubmitButton']")));
            submitButton.Click();

            // Assert
            var errorSummary = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("/html/body/div[1]/main/article/form/ul/li")));
            var fieldError = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("/html/body/div[1]/main/article/form/div[2]/div/div")));

            errorSummary.Text.Should().NotBeNullOrWhiteSpace("hibauzenetnek meg kell jelennie az oldal tetejen");
            fieldError.Text.Should().NotBeNullOrWhiteSpace("hibauzenetnek meg kell jelennie az input mezo alatt is");
        }

        [Test]
        [TestCase(5, 5250)]
        [TestCase(10, 5500)]
        [TestCase(0, 5000)]
        [TestCase(-9.9999, 4500.005)]
        public void Person_SalaryIncrease_ShouldIncrease(double percentage, double expectedSalary)
        {
            // Arrange
            driver.Navigate().GoToUrl(BaseURL);
            driver.FindElement(By.XPath("//*[@data-test='PersonPageNavigation']")).Click();

            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));
            Thread.Sleep(1000);

            var input = wait.Until(ExpectedConditions.ElementExists(By.XPath("//*[@data-test='SalaryIncreasePercentageInput']")));
            input.Clear();
            input.SendKeys(percentage.ToString(CultureInfo.InvariantCulture));

            // Act
            var submitButton = wait.Until(ExpectedConditions.ElementExists(By.XPath("//*[@data-test='SalaryIncreaseSubmitButton']")));
            submitButton.Click();


            // Assert
            var salaryLabel = wait.Until(ExpectedConditions.ElementExists(By.XPath("//*[@data-test='DisplayedSalary']")));
            var salaryAfterSubmission = double.Parse(salaryLabel.Text);
            salaryAfterSubmission.Should().BeApproximately(expectedSalary, 0.001);
        }
        private bool IsElementPresent(By by)
        {
            try
            {
                driver.FindElement(by);
                return true;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        private bool IsAlertPresent()
        {
            try
            {
                driver.SwitchTo().Alert();
                return true;
            }
            catch (NoAlertPresentException)
            {
                return false;
            }
        }

        private string CloseAlertAndGetItsText()
        {
            try
            {
                IAlert alert = driver.SwitchTo().Alert();
                string alertText = alert.Text;
                if (acceptNextAlert)
                {
                    alert.Accept();
                }
                else
                {
                    alert.Dismiss();
                }
                return alertText;
            }
            finally
            {
                acceptNextAlert = true;
            }
        }
    }
}