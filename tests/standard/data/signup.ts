export const signupTestData = {
  shortPassword: 'short7',
  validPassword: 'password1',
  mismatchPassword: {
    first: 'password1',
    second: 'password2',
  },
  names: {
    shortPassword: '短いパス',
    mismatch: '不一致太郎',
    phone: '電話太郎',
    long: '長文太郎',
    emoji: '絵文字太郎',
    newUser: '新規会員',
  },
  longName: '長文太郎'.repeat(10),
  longAddress: '東京都千代田区'.repeat(20),
  newlineAddress: '東京都\n渋谷区\n神南',
  emojiAddress: '東京都港区😊',
};
