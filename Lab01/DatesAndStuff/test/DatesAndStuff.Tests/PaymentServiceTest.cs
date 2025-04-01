using FluentAssertions;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;

namespace DatesAndStuff.Tests
{
    internal class PaymentServiceTest
    {
        [Test]
        public void TestPaymentService_ManualMock_Success()
        {
            // Arrange
            Person sut = new Person("Test Pista",
                new EmploymentInformation(
                    54,
                    new Employer("RO1234567", "Valami city valami hely", "Dagobert bacsi", new List<int> { 6201, 7210 })),
                new TestPaymentService(600), // Elegendő egyenleg
                new LocalTaxData("4367558"),
                new FoodPreferenceParams
                {
                    CanEatChocolate = true,
                    CanEatEgg = true,
                    CanEatLactose = true,
                    CanEatGluten = true
                });

            // Act
            bool result = sut.PerformSubsriptionPayment();

            // Assert
            result.Should().BeTrue();
        }

        [Test]
        public void TestPaymentService_ManualMock_Failure()
        {
            // Arrange
            Person sut = new Person("Test Pista",
                new EmploymentInformation(
                    54,
                    new Employer("RO1234567", "Valami city valami hely", "Dagobert bacsi", new List<int> { 6201, 7210 })),
                new TestPaymentService(400), // Nem elegendő egyenleg
                new LocalTaxData("4367558"),
                new FoodPreferenceParams
                {
                    CanEatChocolate = true,
                    CanEatEgg = true,
                    CanEatLactose = true,
                    CanEatGluten = true
                });

            // Act
            bool result = sut.PerformSubsriptionPayment();

            // Assert
            result.Should().BeFalse();
        }

        [Test]
        public void TestPaymentService_Mock_Success()
        {
            // Arrange
            var paymentService = new Mock<IPaymentService>();

            paymentService.Setup(m => m.GetBalance()).Returns(600);
            paymentService.Setup(m => m.SuccessFul()).Returns(true);

            Person sut = new Person("Test Pista",
                new EmploymentInformation(
                    54,
                    new Employer("RO1234567", "Valami city valami hely", "Dagobert bacsi", new List<int> { 6201, 7210 })),
                paymentService.Object,
                new LocalTaxData("4367558"),
                new FoodPreferenceParams
                {
                    CanEatChocolate = true,
                    CanEatEgg = true,
                    CanEatLactose = true,
                    CanEatGluten = true
                });

            // Act
            bool result = sut.PerformSubsriptionPayment();

            // Assert
            result.Should().BeTrue();
            paymentService.Verify(m => m.StartPayment(), Times.Once);
            paymentService.Verify(m => m.GetBalance(), Times.Once);
            paymentService.Verify(m => m.SpecifyAmount(Person.SubscriptionFee), Times.Once);
            paymentService.Verify(m => m.ConfirmPayment(), Times.Once);
        }

        [Test]
        public void TestPaymentService_Mock_Failure()
        {
            // Arrange
            var paymentService = new Mock<IPaymentService>();

            paymentService.Setup(m => m.GetBalance()).Returns(400);
            paymentService.Setup(m => m.Cancel());

            Person sut = new Person("Test Pista",
                new EmploymentInformation(
                    54,
                    new Employer("RO1234567", "Valami city valami hely", "Dagobert bacsi", new List<int> { 6201, 7210 })),
                paymentService.Object,
                new LocalTaxData("4367558"),
                new FoodPreferenceParams
                {
                    CanEatChocolate = true,
                    CanEatEgg = true,
                    CanEatLactose = true,
                    CanEatGluten = true
                });

            // Act
            bool result = sut.PerformSubsriptionPayment();

            // Assert
            result.Should().BeFalse();
            paymentService.Verify(m => m.StartPayment(), Times.Once);
            paymentService.Verify(m => m.GetBalance(), Times.Once);
            paymentService.Verify(m => m.Cancel(), Times.Once);
            paymentService.Verify(m => m.SpecifyAmount(It.IsAny<double>()), Times.Never);
            paymentService.Verify(m => m.ConfirmPayment(), Times.Never);
        }

        [Test]
        [CustomPersonCreationAutodataAttribute]
        public void TestPaymentService_MockWithAutodata(Person sut, Mock<IPaymentService> paymentService)
        {
            // Arrange
            paymentService.Setup(m => m.GetBalance()).Returns(600);
            paymentService.Setup(m => m.SuccessFul()).Returns(true);

            // Act
            bool result = sut.PerformSubsriptionPayment();

            // Assert
            result.Should().BeTrue();
            paymentService.Verify(m => m.StartPayment(), Times.Once);
            paymentService.Verify(m => m.GetBalance(), Times.Once);
            paymentService.Verify(m => m.SpecifyAmount(Person.SubscriptionFee), Times.Once);
            paymentService.Verify(m => m.ConfirmPayment(), Times.Once);
        }
    }
}
