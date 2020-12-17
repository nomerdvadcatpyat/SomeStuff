const dbapi = require('./dbAPI');


(async function () {
  const users = await Promise.all([
    dbapi.createUser({ login: 'qwerty', password: '123456' }),
    dbapi.createUser({ login: 'SOmeLogin', password: 'qwer123' }),
    dbapi.createUser({ login: 'AnotherLogin', password: 'ajlkshdkahduiyi123' })
  ]);

  await Promise.all(
    [
      dbapi.uploadImage( { fullImage: './images/1.jpg', alt: 'Морская свинка Эльза', owner: users[2] }),
      dbapi.uploadImage( { fullImage: './images/2.jpg', alt: 'Морская свинка Антон', owner: users[2] }),
      dbapi.uploadImage( { fullImage: './images/3.jpg', alt: 'Морская свинка Афина', owner: users[0] }),
      dbapi.uploadImage( { fullImage: './images/4.jpg', alt: 'Морская свинка Александр', owner: users[1] }),
      dbapi.uploadImage( { fullImage: './images/5.jpg', alt: 'Морская свинка Виолетта', owner: users[1] })
    ]);

  // await dbapi.removeImages({});
  // await dbapi.removeUsers({});

  dbapi.closeConnection();
  
})();
