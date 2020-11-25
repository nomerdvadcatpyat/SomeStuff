'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    this.counter = 0;
    this.guests = [];
    let firendsCircles = getFriends(friends, this.maxLevel);
    for(let circle of firendsCircles) {
        this.guests.push(...circle.filter(filter.condition));
    }
}

Iterator.prototype.next = function() {
    if(this.done()) return null;
    return this.guests[this.counter++];
};

Iterator.prototype.done = function() {
    return this.counter === this.guests.length;
}

function getFriends(friendsBook, deep = Infinity) {
    const friendsCircles = [];
    let currCircle = friendsBook.filter(friend => friend.best);
    
    for(let i = 0; i < deep; i++) {
        if(currCircle.length === 0) break;

        currCircle.sort((first, second) => {
            if (first.name > second.name) return 1;
            if (first.name < second.name) return -1;
            return 0;
            });

        friendsCircles.push(currCircle);
        const newCircle = [];
        for(let friend of currCircle) {
            let friendFriends = friend.friends.map(name => friendsBook.find(friend => friend.name === name));
            newCircle.push(...friendFriends.filter(person => isPersonInFriendsCircle(newCircle, person)));
        }
        currCircle = newCircle;
    }

    function isPersonInFriendsCircle(newCircle, person) {
        for (const circle of friendsCircles) {
            if (circle.includes(person) || newCircle.includes(person)) {
                return false;
            }
        }
        return true;
    } 

    return friendsCircles;
}


/**
 * Итератор по друзьям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel ) {
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.condition = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.condition = guest => guest.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.condition = guest => guest.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;