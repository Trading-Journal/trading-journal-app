import { config } from '../utilities/config';
import { apiFormat } from '../utilities/dateTimeUtilities';
import { readErrors } from './readErrors';

export const getEntries = (
  accessToken,
  journalId,
  status,
  symbol,
  type,
  from
) => {
  let url = `${config.entries}/journals/${journalId}/entries?`;
  if (status) {
    url += `status=${status}&`;
  }
  if (symbol) {
    url += `symbol=${symbol}&`;
  }
  if (type) {
    url += `type=${type}&`;
  }
  if (from) {
    url += `from=${from}&`;
  }
  return fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(responseOrError);
};

export const getOpenTradesCount = (accessToken, journalId) => {
  return fetch(`${config.entries}/journals/${journalId}/entries/open`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(responseOrError);
};

export const saveTrade = (accessToken, journalId, trade, tradeId) => {
  let url = `${config.entries}/journals/${journalId}/entries/trade`;
  let method = 'POST';
  if (tradeId) {
    url += `/${tradeId}`;
    method = 'PATCH';
  }

  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...trade,
      date: apiFormat(trade.date),
      exitDate: apiFormat(trade.exitDate),
    }),
  }).then(responseOrError);
};

export const saveDeposit = (accessToken, journalId, deposit) => {
  return fetch(`${config.entries}/journals/${journalId}/entries/deposit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...deposit,
      date: apiFormat(deposit.date),
    }),
  }).then(responseOrError);
};

export const saveWithdrawal = (accessToken, journalId, withdrawal) => {
  return fetch(`${config.entries}/journals/${journalId}/entries/withdrawal`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...withdrawal,
      date: apiFormat(withdrawal.date),
    }),
  }).then(responseOrError);
};

export const saveTaxes = (accessToken, journalId, taxes) => {
  return fetch(`${config.entries}/journals/${journalId}/entries/taxes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...taxes,
      date: apiFormat(taxes.date),
    }),
  }).then(responseOrError);
};

export const deleteEntry = (accessToken, journalId, entryId) => {
  return fetch(`${config.entries}/journals/${journalId}/entries/${entryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    if (response.ok) return response;
    else {
      const errors = await readErrors(response);
      throw new Error(errors);
    }
  });
};

const responseOrError = async (response) => {
  if (response.ok) return response.json();
  else {
    const errors = await readErrors(response);
    throw new Error(errors);
  }
};
