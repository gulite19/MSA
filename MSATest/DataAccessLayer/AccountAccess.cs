using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{

    public class AccountAccess : IAccountAccess

    {
        private string accountDataFileName = @"E:\MyTest.txt";
        private Dictionary<string, string> accountDictionary = new Dictionary<string, string>();
        private char accountPairSymbol = ':';
        public AccountAccess()
        {
            if (!File.Exists(accountDataFileName))
            {
                File.Create(accountDataFileName);
            }
            using (StreamReader sr = new StreamReader(accountDataFileName, Encoding.Default))
            {
                String line;
                while ((line = sr.ReadLine()) != null)
                {
                    string[] accountPair = line.Split(new char[] { accountPairSymbol });
                    if (accountPair != null && accountPair.Length == 2)
                    {
                        this.accountDictionary.Add(accountPair[0], accountPair[1]);
                    }
                }
            }



        }
        public string Register(string account, string password)
        {
            if (this.accountDictionary.ContainsKey(account))
            {
                return "Sorry, duplicate Username.";
            }
            try
            {
                using (StreamWriter sw = new StreamWriter(accountDataFileName, true))
                {
                    sw.WriteLine(account + ":" + password);
                    sw.Flush();
                    sw.Close();
                    
                }
                //using (FileStream fs = File.Create(accountDataFileName))
                //{

                //    fs.Close();
                //}
                this.accountDictionary.Add(account, password);
                return "Success";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
        public bool Login(string account, string password)
        {
            if (this.accountDictionary.ContainsKey(account))
            {
                if (accountDictionary[account].Equals(password))
                {
                    return true;
                }

            }
            return false;
        }

    }

}
