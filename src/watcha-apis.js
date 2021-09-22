/*
Copyright 2021 Watcha

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * This is an internal module. WatchaApis is currently only meant to be used
 * by {@link client~MatrixClient}.
 *
 * @module watcha-apis
 */

import * as utils from "./utils";

import { NextcloudApis } from "./watcha-nextcloud-apis";

/**
 * URI path for the Watcha API
 */
export const PREFIX_WATCHA = "/_watcha";

/**
 * Low-level wrappers for the Watcha APIs
 */
export function WatchaApis(opts) {
  NextcloudApis.call(this, opts);
}
utils.extend(WatchaApis.prototype, NextcloudApis.prototype);

/**
 * Return whether the client is configured for a partner account.
 * @return {boolean} True if this is a partner account.
 */
WatchaApis.prototype.isPartner = function () {
  return this._isPartner;
};

/**
 * Set whether this client is a partner account.
 * @param {boolean} isPartner True if this is a partner account.
 */
WatchaApis.prototype.setPartner = function (isPartner) {
  this._isPartner = isPartner;
};
