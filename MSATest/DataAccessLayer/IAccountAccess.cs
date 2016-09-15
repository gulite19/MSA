using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    interface IAccountAccess
    {
        string Register(string account, string password);

        bool Login(string account, string password);

    }
}
