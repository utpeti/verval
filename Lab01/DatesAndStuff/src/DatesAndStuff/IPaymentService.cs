﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatesAndStuff
{
    public interface IPaymentService
    {
        public void StartPayment();

        public void SpecifyAmount(double amount);

        public void ConfirmPayment();

        public void Cancel();
        public bool SuccessFul();

        public double GetBalance();
    }
}
