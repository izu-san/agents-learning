export type UserKey = 'premium' | 'standard';

export const users: Record<UserKey, {
  email: string;
  password: string;
  name?: string;
  rank: string;
}> = {
  premium: {
    email: 'ichiro@example.com',
    password: 'password',
    name: '山田一郎',
    rank: 'プレミアム会員',
  },
  standard: {
    email: 'sakura@example.com',
    password: 'pass1234',
    rank: '一般会員',
  },
};

export const signupDefaults = {
  password: 'password1',
  name: 'テスト太郎',
  membership: '一般会員' as const,
};
