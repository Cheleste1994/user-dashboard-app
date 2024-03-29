import { describe, expect, it } from 'vitest';
import userReducer, { UserState } from '../store/slice/user.slice';

describe('Store', () => {
  it('should return default User state when passed an empty action', () => {
    const initialState: UserState = {
      email: null,
      isAuth: false,
      uid: null,
    };

    const result = userReducer(undefined, { type: '' });

    expect(result).toEqual(initialState);
  });
});
