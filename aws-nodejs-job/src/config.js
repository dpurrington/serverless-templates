const yaml = require('js-yaml');
const fs = require('fs');
const rp = require('request-promise');
const mem = require('mem');
const jwt = require('./jwt');

const { CONFIG_SERVICE_URI } = process.env;

const CONFIG_MAX_AGE = 1000 * 60 * 3; // value is in ms, so this is 3 minutes

const getAccountsFromDoc = (doc) => {
  const accounts = doc.trial_accounts;

  Object.values(accounts).forEach((a) => {
    a.trial = { endDate: a.end_date, usageCap: a.usage_cap };
    delete a.end_date;
    delete a.usage_cap;
  });

  // upsert flags
  doc.over_consumption_override.forEach((id) => { accounts[id] = { ...accounts[id], overconsumptionOverride: true }; });
  doc.require_project_code.forEach((id) => { accounts[id] = { ...accounts[id], requireProjectCode: true }; });
  doc.always_show_modal.forEach((id) => { accounts[id] = { ...accounts[id], alwaysShowModal: true }; });
  // upsert custom modal language
  Object.entries(doc.custom_project_code_required)
    .forEach(([id, { modalLanguage }]) => { accounts[id] = { ...accounts[id], customProjectCodeLanguage: modalLanguage }; });

  return accounts;
};

exports.get = mem(async () => {
  console.log('Loading configuration from yaml file and config service');
  try {
    const original = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
    const toUpdate = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

    const config = await rp({
      uri: `${CONFIG_SERVICE_URI}/v1/configs/accounts`,
      headers: {
        Authorization: `Bearer ${await jwt.get()}`,
      },
      json: true,
    });

    return [original, getAccountsFromDoc(toUpdate), config];
  } catch (e) {
    console.log('Error loading config: ', e);
    throw e;
  }
}, { maxAge: CONFIG_MAX_AGE });
