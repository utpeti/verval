﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatesAndStuff
{
    public class EmploymentInformation
    {
        public double Salary { get; private set; }

        public Employer Employer { get; private set; }

        public EmploymentInformation(double salary, Employer e)
        {
            this.Salary = salary;
            this.Employer = e;
        }

        public void IncreaseSalary(double percentage)
        {
            if (percentage <= -10)
                throw new ArgumentOutOfRangeException(nameof(percentage));

            this.Salary = this.Salary * (1 + percentage / 100);
        }
    }
}
