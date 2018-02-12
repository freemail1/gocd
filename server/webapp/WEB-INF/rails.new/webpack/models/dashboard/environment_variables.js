/*
 * Copyright 2018 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const _      = require('lodash');
const Stream = require('mithril/stream');
const s      = require('helpers/string-plus');

const Mixins         = require('models/mixins/model_mixins');
const EncryptedValue = require('models/pipeline_configs/encrypted_value');

function plainOrCipherValue({secure, value}) {
  if (secure) {
    const encryptedValue = new EncryptedValue({cipherText: ''});
    encryptedValue.preventEdit();
    return encryptedValue;
  } else {
    return new EncryptedValue({clearText: s.defaultToIfBlank(value, '')});
  }
}

const EnvironmentVariable = function ({name, value, secure} = {}) {
  this.name          = Stream(name);
  const _value       = Stream(plainOrCipherValue({secure, value}));

  Mixins.HasEncryptedAttribute.call(this, {attribute: _value, name: 'value'});
};

EnvironmentVariable.fromJSON = (json) => {
  return new EnvironmentVariable(json);
};

const EnvironmentVariables    = {};
EnvironmentVariables.fromJSON = (json) => {
  return _.map(json, (variable) => EnvironmentVariable.fromJSON(variable));
};

module.exports = EnvironmentVariables;
