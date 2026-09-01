export interface UserTestData {
    username: string;
    password: string;
    errorMessage: string;
}

export const standardUser: UserTestData = {
    username: 'standard_user',
    password: 'secret_sauce',
    errorMessage: '',
};

export const lockedOutUser: UserTestData = {
    username: 'locked_out_user',
    password: 'secret_sauce',
    errorMessage: 'Epic sadface: Sorry, this user has been locked out.',
};

export const problemUser: UserTestData = {
    username: 'problem_user',
    password: 'secret_sauce',
    errorMessage: '',
};

export const performanceGlitchUser: UserTestData = {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    errorMessage: '',
};

export const errorUser: UserTestData = {
    username: 'error_user',
    password: 'secret_sauce',
    errorMessage: '',
};

export const visualUser: UserTestData = {
    username: 'visual_user',
    password: 'secret_sauce',
    errorMessage: '',
};