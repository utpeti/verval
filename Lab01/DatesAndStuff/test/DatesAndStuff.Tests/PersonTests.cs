using FluentAssertions;
using NUnit.Framework.Internal;

namespace DatesAndStuff.Tests;

public class PersonTests
{
    Person sut;

    [SetUp]
    public void Setup()
    {
        this.sut = new Person("Test Pista", 54);
    }

    [TearDown]
    public void TearDown()
    {

    }

    private class MerriedTests : PersonTests
    {
        [Test]
        public void GotMerried_First_NameShouldChange()
        {
            // Arrange
            string newName = "Test-Eleso Pista";
            double salaryBeforeMarriage = sut.Salary;
            var beforeChanges = Person.Clone(sut);

            // Act
            sut.GotMarried(newName);

            // Assert
            Assert.That(sut.Name, Is.EqualTo(newName)); // act = exp

            sut.Name.Should().Be(newName);
            sut.Should().BeEquivalentTo(beforeChanges, o => o.Excluding(p => p.Name));

            //sut.Salary.Should().Be(salaryBeforeMarriage);

            //Assert.AreEqual(newName, sut.Name); // = (exp, act)
            //Assert.AreEqual(salaryBeforeMarriage, sut.Salary);
        }

        [Test]
        public void GotMerried_Second_ShouldFail()
        {
            // Arrange
            string newName = "Test-Eleso-Felallo Pista";
            sut.GotMarried("");

            // Act
            var task = Task.Run(() => sut.GotMarried(""));
            try { task.Wait(); } catch { }

            // Assert
            Assert.IsTrue(task.IsFaulted);
        }
    }

    private class SalaryTests : PersonTests
    {
        [Test]
        public void IncreaseSalary_PositiveIncrease_ShouldIncrease()
        {
            //Arrange
            double increase = 10;
            double expected = sut.Salary * (1 + increase / 100);

            //Act
            sut.IncreaseSalary(increase);

            //Assert
            Assert.That(sut.Salary, Is.EqualTo(expected));
        }

        [Test]
        public void IncreaseSalary_ZeroPercentIncrease_ShouldNotChange()
        {
            //Arrange
            double increase = 0;
            double expected = sut.Salary;

            //Act
            sut.IncreaseSalary(increase);

            //Assert
            Assert.That(sut.Salary, Is.EqualTo(expected));
        }

        [Test]
        public void IncreaseSalary_NegativeIncrease_ShouldDecrease()
        {
            //Arrange
            double increase = -9;
            double expected = sut.Salary * (1 + increase / 100);

            //Act
            sut.IncreaseSalary(increase);

            //Assert
            Assert.AreEqual(expected, sut.Salary);
        }

        [Test]
        public void IncreaseSalary_SmallerThanMinusTenPerc_ShouldFail()
        {
            //Arrange
            double increase = -11;

            //Act

            //Assert
            Assert.Throws<ArgumentOutOfRangeException>(() => sut.IncreaseSalary(increase));
        }
    }
}