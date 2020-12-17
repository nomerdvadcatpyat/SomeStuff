const express = require('express');
const router = express.Router();

const pigs = [
  { id: 1, name: "Эльза", href: "/images/1.jpg"},
  { id: 2, name: "Антон", href: "/images/2.jpg"},
  { id: 3, name: "Афина", href: "/images/3.jpg"},
  { id: 4, name: "Александр", href: "/images/4.jpg"},
  { id: 5, name: "Виолетта", href: "/images/5.jpg"},
]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Морские свинки', pigs: pigs });
});

router.get('/pig', function(req, res, next) {
  const image = pigs.find(i => i.id == req.query.id);
  res.render('pig', { pig: image});
});

module.exports = router;
