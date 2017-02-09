"use strict";
const mongo_monk_1 = require("../../../utils/mongo-monk");
const config_1 = require("../../../config");
const collectionsConfig = config_1.configuration.collections;
const appConfig = config_1.configuration.app;
const db = (new mongo_monk_1.Mongo()).getCollection(collectionsConfig.users.name);
;
class UserService {
    findOne(username, id, options) {
        return db.findOne(username ? { username } : { _id: id }, options);
    }
    update(user) {
        return db.findOneAndUpdate({ _id: user.id }, user);
    }
    save(user) {
        return db.insert(user);
    }
}
;
const userService = new UserService();
exports.userService = userService;
//# sourceMappingURL=service.js.map