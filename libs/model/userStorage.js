var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Subscription = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    subscribedOn: { type: Date, required: true },
    recurrence: { type: String, required: true },
    renewalDate: { type: Date, required: false },
    autoRenews: { type: Boolean, required: true }
});

var UserStorage = new Schema({
    subscriptions: [Subscription],
    owner: { type: String, required: true }
});

// UserStorage.path('name').validate(function (v) {
//     return true;
// });

module.exports = mongoose.model('UserStorage', UserStorage);
