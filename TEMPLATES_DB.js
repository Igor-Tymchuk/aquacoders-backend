const water = {
  _id: '67a1f598a6ed272da1c633fd' /*Генерується бекендом, ObjectId*/,
  volume: 250 /*Вода в мл, Number, min 50, max 5000*/,
  date: '2025-03-05T12:12' /*Дата вживання води, String*/,
  userId: '67a1f598a6ed272da1c632df' /*_id Зареєстрованого власника, ObjectId*/,
};

const user = {
  _id: '67a1f598a6ed272da1c632df' /*Генерується бекендом, ObjectId*/,
  name: 'Roberto' /*Ім'я користувача, String, default "", min.length 2, max.length 12*/,
  email:
    'roberto-joker@gmail.com' /*Пошта користувача, обов'язково, String, email*/,
  password:
    '$2b$10$xv2nMv1gefCwV1weV0pAA.H/FxKLuM663uyW0QfYL87k19xb2ou6a' /*Хешований пароль користувача, обов'язково, String*/,
  gender:
    'man' /*Стать користувача, String, Enum [none, male, female], default "none"*/,
  weight: 98 /*Вага користувача в кг Number, min 0, max 250*/,
  dailySportTime: 3 /*Час спорту користувача год/день Number, min 0, max 24*/,
  dailyNorm: 2500 /*Встановлена норма води мл/день користувачем Number, min 500, max 15000, default 1500*/,
  avatarURL:
    'https://res.cloudinary.com/douwe7mix/image/upload/v1738700367/ily2elrvnt2hradnczj3.jpg' /*шлях до фото профідю користувача, String, default ""*/,
};

const session = {
  _id: '679c04f8ca7f919561e696a5' /*Генерується бекендом, ObjectId*/,
  userId: '67a1f598a6ed272da1c632df' /*_id Зареєстрованого власника, ObjectId*/,
  accessToken:
    '22bjpTKZR5jet/pgIIvcSlWYWzfzsrDJwIu7P/sq' /*Токен доступу, String*/,
  refreshToken:
    'sPuYhZwft7QxBC1JH4XoIBOGpHTiFIPRWf+wROMc' /*Токен оновлення доступу, String*/,
  accessTokenValidUntil:
    '2025-03-05T23:17:16.025+00:00' /*Час життя токену доступу, Date*/,
  refreshTokenValidUntil:
    '2025-06-05T23:02:16.025+00:00' /*Час життя токену оновлення доступу, Date*/,
};

water, session, user;
