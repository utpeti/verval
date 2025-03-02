namespace DatesAndStuff.Tests
{
    public class SimulationTimeTests
    {
        private SimulationTime sut;

        [OneTimeSetUp]
        public void OneTimeSetupStuff()
        {
            this.sut = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 49));
        }

        [SetUp]
        public void Setup()
        {
            // minden teszt felteheti, hogz elotte lefutott ez
        }

        [TearDown]
        public void TearDown()
        {
        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
        }

        private class ConstructorTests
        {
            [Test]
            // Default time is not current time.
            // Given_When_Then pattern ...
            public void DateTime_ConstructingWithDateTime_CorrectTime()
            {
                throw new NotImplementedException();
            }

            [Test]
            public void YearMonthDay_ConstructingWithYearMonthDay_CorrectTime()
            {
                throw new NotImplementedException();
            }

            [Test]
            public void YearMonthDayHourMinuteSecond_ConstructingWithYearMonthDayHourMinuteSecond_CorrectTime()
            {
                throw new NotImplementedException();
            }

            [Test]
            public void LogicalTickString_ConstructingWithLogicalTickString_CorrectTime()
            {
                throw new NotImplementedException();
            }
        }

        private class ComparisonTests : SimulationTimeTests
        {
            // equal
            // not equal
            // <
            // >
            // <= different
            // >= different 
            // <= same
            // >= same
            // max
            // min

            [Test]
            public void Operator_Equals_ReturnTrueForSameTimes()
            {
                //Arrange
                var sut2 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 50));
                var sut3 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 50));

                //Act
                var result = sut2 == sut3;

                //Assert
                Assert.IsTrue(result);
            }

            [Test]
            public void Operator_NotEquals_ReturnTrueForDifferentTimes()
            {
                //Arrange
                var sut2 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 50));
                var sut3 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 51));

                //Act
                var result = sut2 != sut3;

                //Assert
                Assert.IsTrue(result);
            }

            [Test]
            public void Operator_LessThan_ReturnTrueForEarlierTime()
            {
                //Arrange
                var sut2 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 50));
                var sut3 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 51));

                //Act
                var result = sut2 < sut3;

                //Assert
                Assert.IsTrue(result);
            }

            [Test]
            public void Operator_GreaterThan_ReturnTrueForLaterTime()
            {
                //Arrange
                var sut2 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 50));
                var sut3 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 51));

                //Act
                var result = sut3 > sut2;

                //Assert
                Assert.IsTrue(result);
            }

            [Test]
            public void Operator_LessThanOrEqual_ReturnTrueForEarlierTime()
            {
                //Arrange
                var sut2 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 50));
                var sut3 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 51));

                //Act
                var result = sut2 <= sut3;

                //Assert
                Assert.IsTrue(result);
            }

            [Test]
            public void Operator_LessThanOrEqual_ReturnTrueForSameTime()
            {
                //Arrange
                var sut2 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 50));
                var sut3 = new SimulationTime(new DateTime(2024, 4, 23, 9, 4, 50));

                //Act
                var result = sut2 <= sut3;

                //Assert
                Assert.That(result);
            }
        }

        private class TimeSpanArithmeticTests
        {

            [Test]
            // TimeSpanArithmetic
            // add
            // substract
            // Given_When_Then
            public void Addition_AddingTimeSpan_SimulationTimeIsShifted()
            {
                // UserSignedIn_OrderSent_OrderIsRegistered
                // DBB, specflow, cucumber, gherkin

                // Arrange
                DateTime baseDate = new DateTime(2010, 8, 23, 9, 4, 49);
                SimulationTime sut = new SimulationTime(baseDate);

                var ts = TimeSpan.FromMilliseconds(4544313);

                // Act
                var result = sut + ts;

                // Assert
                var expectedDateTime = baseDate + ts;
                Assert.AreEqual(expectedDateTime, result.ToAbsoluteDateTime());
            }

            [Test]
            //Method_Should_Then
            public void Subtraction_SubtractingTimeSpan_SimulationTimeIsShifted()
            {
                // code kozelibb
                // RegisterOrder_SignedInUserSendsOrder_OrderIsRegistered
                throw new NotImplementedException();
            }
        }

        private class RepresentationTests
        {
            [Test]
            // millisecond representation works
            public void MillisecondRepresentation_RepresentTimeInMilliseconds_ReturnCorrectValue()
            {
                throw new NotImplementedException();
            }

            [Test]
            // check string representation given by ToString
            public void StringRepresentation_ToString_ReturnCorrectString()
            {
                throw new NotImplementedException();
            }
        }

        private class CalculationTests
        {
            [Test]
            // simulation difference timespane and datetimetimespan is the same
            public void SimulationTimeSubstraction_SubtractSimulationTime_ReturnCorrectDifference()
            {
                throw new NotImplementedException();
            }

            [Test]
            // next millisec calculation works
            public void NextMillisecCalculation_CalculateNextMillisec_ReturnCorrectValue()
            {
                throw new NotImplementedException();
            }

            [Test]
            // creat a SimulationTime from a DateTime, add the same milliseconds to both and check if they are still equal
            public void AddMilliseconds_AddingSameValue_RemainEqual()
            {
                throw new NotImplementedException();
            }

            [Test]
            // the same as before just with seconds
            public void AddSeconds_AddingSameValue_RemainEqual()
            {
                throw new NotImplementedException();
            }

            [Test]
            // same as before just with timespan
            public void AddTimeSpan_AddingSameValue_RemainEqual()
            {
                throw new NotImplementedException();
            }
        }
    }
}
