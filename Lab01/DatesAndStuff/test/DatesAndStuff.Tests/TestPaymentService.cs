﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatesAndStuff.Tests
{
    internal class TestPaymentService : IPaymentService
    {
        uint startCallCount = 0;
        uint specifyCallCount = 0;
        uint confirmCallCount = 0;
        //bool isCanceled = false;
        readonly double balance = 0;

        public TestPaymentService(double initialBalance)
        {
            balance = initialBalance;
        }

        public TestPaymentService()
        {
        }

        public void StartPayment()
        {
            if (startCallCount != 0 || specifyCallCount > 0 || confirmCallCount > 0)
                throw new Exception();

            startCallCount++;
        }

        public void SpecifyAmount(double amount)
        {
            if (startCallCount != 1 || specifyCallCount > 0 || confirmCallCount > 0)
                throw new Exception();

            specifyCallCount++;
        }

        public void ConfirmPayment()
        {
            if (startCallCount != 1 || specifyCallCount != 1 || confirmCallCount > 0)
                throw new Exception();

            confirmCallCount++;
        }

        public bool SuccessFul()
        {
            return startCallCount == 1 && specifyCallCount == 1 && confirmCallCount == 1;
        }

        public void Cancel()
        {
            if (startCallCount == 0)
                throw new Exception("Cannot cancel before starting payment");

            //isCanceled = true;
        }

        public double GetBalance()
        {
            return balance;
        }
    }
}
