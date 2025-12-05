/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const tradeContract = require('./lib/tradeContract');

module.exports.TradeContract = tradeContract;
module.exports.contracts = [tradeContract];
