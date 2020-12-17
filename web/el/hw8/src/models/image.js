const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @param {String} fullImage путь к полноразмерной картинке на сервере
 * @param {String} alt описание картинки
 * @param {Schema.Types.ObjectId} owner id того, кто загрузил картинку
 */
const ImageSchema = new Schema(
    {
        fullImage: String,
        alt: String,
        owner: {type: Schema.Types.ObjectId, ref: 'User' }
    }
);

ImageSchema
.virtual('url')
.get( function () {
    return '/image/' + this._id;
});

module.exports = mongoose.model('Image', ImageSchema);