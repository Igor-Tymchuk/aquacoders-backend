const water = {
  _id: '67a1f598a6ed272da1c633fd' /*Генерується бекендом, ObjectId*/,
  volume: 250 /*Вода в мл, обов'язково, Number, min 50, max 5000*/,
  date: '2025-03-05T12:12' /*Дата вживання води, обов'язково, String*/,
  userId:
    '67a1f598a6ed272da1c632df' /*_id Зареєстрованого власника, обов'язково, ObjectId*/,
};

const user = {
  _id: '67a1f598a6ed272da1c632df' /*Генерується бекендом, ObjectId*/,
  name: 'Roberto' /*Ім'я користувача, String, default "", min.length 2, max.length 12*/,
  email:
    'roberto-joker@gmail.com' /*Пошта користувача, обов'язково, String, email*/,
  password:
    '$2b$10$xv2nMv1gefCwV1weV0pAA.H/FxKLuM663uyW0QfYL87k19xb2ou6a' /*Хешований пароль користувача, обов'язково, String*/,
  gender:
    'man' /*Стать користувача, обов'язково, String, Enum [male, female], default "female"*/,
  weight: 98 /*Вага користувача в кг, обов'язково, Number, min 0, max 250 default, 0*/,
  dailySportTime: 3 /*Час спорту користувача год/день Number, обов'язково, min 0, max 24, default 0*/,
  dailyNorm: 2500 /*Встановлена норма води мл/день користувачем, обов'язково, Number, min 500, max 15000, default 1500*/,
  avatarUrl:
    'https://res.cloudinary.com/douwe7mix/image/upload/v1738700367/ily2elrvnt2hradnchj3.jpg' /*шлях до фото профідю користувача, обов'язково, String, default ""*/,
};

const session = {
  _id: '679c04f8ca7f919561e696a5' /*Генерується бекендом, ObjectId*/,
  userId:
    '67a1f598a6ed272da1c632df' /*_id Зареєстрованого власника, обов'язково, ObjectId*/,
  accessToken:
    '22bjpTKZR5jet/pgIIvcSlWYWzfzsrDJwIu7P/sq' /*Токен доступу, обов'язково, String*/,
  refreshToken:
    'sPuYhZwft7QxBC1JH4XoIBOGpHTiFIPRWf+wROMc' /*Токен оновлення доступу, обов'язково, String*/,
  accessTokenValidUntil:
    '2025-03-05T23:17:16.025+00:00' /*Час життя токену доступу, обов'язково, Date*/,
  refreshTokenValidUntil:
    '2025-06-05T23:02:16.025+00:00' /*Час життя токену оновлення доступу, обов'язково, Date*/,
};

water, session, user;
