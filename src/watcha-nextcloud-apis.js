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
 * This is an internal module. NextcloudApis is currently only meant to be used
 * by {@link client~MatrixClient}.
 *
 * @module watcha-nextcloud-apis
 */

import * as utils from "./utils";
import { MatrixHttpApi } from "./http-api";

import { PREFIX_WATCHA } from "./watcha-apis";

/**
 * URI path for the Nextcloud API
 */
const PREFIX_NEXTCLOUD = "/nextcloud";

export const CALENDAR_EVENT_TYPE = "watcha.room.nextcloud_calendar";

/**
 * Low-level wrappers for the Nextcloud APIs
 *
 * @constructor
 *
 * @param {Object} opts Configuration options
 *
 * @param {string} opts.baseUrl Required. The base URL to the client-server
 * HTTP API.
 *
 * @param {Function} opts.request Required. The function to invoke for HTTP
 * requests. The value of this property is typically <code>require("request")
 * </code> as it returns a function which meets the required interface. See
 * {@link requestFunction} for more information.
 *
 * @param {string} opts.accessToken The access_token for this user.
 *
 * @param {Number=} opts.localTimeoutMs Optional. The default maximum amount of
 * time to wait before timing out HTTP requests. If not specified, there is no
 * timeout.
 *
 * @param {Object} opts.queryParams Optional. Extra query parameters to append
 * to all requests with this client. Useful for application services which require
 * <code>?user_id=</code>.
 *
 * @param {boolean} [opts.useAuthorizationHeader = false] Set to true to use
 * Authorization header instead of query param to send the access token to the server.
 */
export function NextcloudApis(opts) {
  utils.checkObjectHasKeys(opts, ["baseUrl", "request"]);

  const httpOpts = {
    baseUrl: opts.baseUrl,
    accessToken: opts.accessToken,
    request: opts.request,
    prefix: PREFIX_WATCHA + PREFIX_NEXTCLOUD,
    onlyData: true,
    extraParams: opts.queryParams,
    localTimeoutMs: opts.localTimeoutMs,
    useAuthorizationHeader: opts.useAuthorizationHeader,
  };
  this._nextcloud_http = new MatrixHttpApi(this, httpOpts);
}

/**
 * @return {Promise} Resolves: <code>{id: {string}, displayname: {string}}</code>
 * @return {module:http-api.MatrixError} Rejects: with an error response.
 */
NextcloudApis.prototype.getOwnCalendars = function () {
  return this._nextcloud_http.authedRequest(undefined, "GET", "/calendars");
};

/**
 * @param {string} calendarId
 * @return {Promise} Resolves: Empty object
 * @return {module:http-api.MatrixError} Rejects: with an error response.
 */
NextcloudApis.prototype.getCalendar = function (calendarId) {
  const path = utils.encodeUri("/calendars/$calendarId", {
    $calendarId: calendarId,
  });
  return this._nextcloud_http.authedRequest(undefined, "GET", path);
};

/**
 * @param {string} calendarId
 * @return {Promise} Resolves: Empty object
 * @return {module:http-api.MatrixError} Rejects: with an error response.
 */
NextcloudApis.prototype.reorderCalendars = function (calendarId) {
  const path = utils.encodeUri("/calendars/$calendarId/top", {
    $calendarId: calendarId,
  });
  return this._nextcloud_http.authedRequest(undefined, "PUT", path);
};

/**
 * @param {string} roomId
 * @param {string} calendarId Optional.
 * @return {Promise} Resolves: TODO
 * @return {module:http-api.MatrixError} Rejects: with an error response.
 */
NextcloudApis.prototype.setRoomCalendar = async function (
  roomId,
  calendarId = null
) {
  return this.sendStateEvent(roomId, CALENDAR_EVENT_TYPE, {
    id: calendarId,
  });
};

/**
 * @param {string} roomId
 * @param {string} stateKey
 * @return {Promise} Resolves: TODO
 * @return {module:http-api.MatrixError} Rejects: with an error response.
 */
NextcloudApis.prototype.unsetRoomCalendar = async function (roomId, stateKey) {
  return this.sendStateEvent(roomId, CALENDAR_EVENT_TYPE, {}, stateKey);
};
