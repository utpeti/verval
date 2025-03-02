namespace DatesAndStuff.Tests
{
    public sealed class SimulationTimeTests
    {
        [OneTimeSetUp]
        public void OneTimeSetupStuff()
        {
            // 
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

        [Test]
        // Default time is not current time.
        public void SimulationTime_Construction()
        {
            throw new NotImplementedException();
        }

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
        public void Constructor_DefaultTime_NotBeCurrentTime()
        {
            throw new NotImplementedException();
        }

        [Test]
        public void Operator_Equals_ReturnTrueForSameTimes()
        {
            throw new NotImplementedException();
        }

        [Test]
        public void Operator_NotEquals_ReturnTrueForDifferentTimes()
        {
            throw new NotImplementedException();
        }

        [Test]
        public void Operator_LessThan_ReturnTrueForEarlierTime()
        {
            throw new NotImplementedException();
        }

        [Test]
        public void Operator_GreaterThan_ReturnTrueForLaterTime()
        {
            throw new NotImplementedException();
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


        [Test]
        // simulation difference timespane and datetimetimespan is the same
        public void SubtractSimulationTime_ReturnCorrectDifference()
        {
            throw new NotImplementedException();
        }

        [Test]
        // millisecond representation works
        public void MillisecondRepresentation_WorkCorrectly()
        {
            throw new NotImplementedException();
        }

        [Test]
        // next millisec calculation works
        public void NextMillisec_CalculateCorrectly()
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

        [Test]
        // check string representation given by ToString
        public void ToString_ReturnCorrectStringRepresentation()
        {
            throw new NotImplementedException();
        }
    }
}