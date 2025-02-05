import dayjs from 'dayjs';
import { makeId } from '../../lib/utils';
import { AccountsEntity } from '../../types';

/**
 * @see https://developers.oxlin.io/reference-accounts-api/#section/File-structure
 */
export async function getTextStringFromAcc(accounts: AccountsEntity[]) {
  let txtStr: string = `CREDENTIALS|dev|dev\nCREDENTIALS_OWNER|${accounts[0].owners[0].name}\n`;

  accounts.forEach((account, index) => {
    const accountId: string = makeId(12);
    const accountName = account.number || `account ${(index + 1).toString().padStart(2, '0')}`;

    txtStr += `\nACCOUNT|${accountId}|${accountName}|${formatDate(account.balanceDate)}|${
      account.balance
    }|${getAccountType(account.type)}||false|${account.owners[0].name}|${accountName}||||EUR\n`;

    txtStr += getTransactionStr(account.transactions);
  });

  return txtStr;
}

function getAccountType(type: string): string {
  switch (type) {
    case 'CHECKING':
      return 'Checkings';

    case 'SAVINGS':
      return 'Savings';

    case 'LOAN':
      return 'Loans';

    case 'CREDIT_CARD':
      return 'CreditCard';

    default:
      return 'unknown';
  }
}

function getTransactionStr(transactions: any): string {
  let result: string = '';
  for (const transaction of transactions) {
    result += `TRANSACTION|${transaction.amount}|${formatDate(transaction.dates.debitedAt)}|${
      transaction.description
    }\n`;
  }

  return result;
}

function formatDate(date: string): string {
  return dayjs(date).format('DD/MM/YY');
}
