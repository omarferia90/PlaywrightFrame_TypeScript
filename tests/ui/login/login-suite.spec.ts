import { test } from '../../../src/fixtures/test-fixtures';
import { standardUser } from '../../../src/fixtures/data/login.data';
import { lockedOutUser} from '../../../src/fixtures/data/login.data';
import { problemUser} from '../../../src/fixtures/data/login.data';


test.describe('Login - UI', () => {
    
    test('login with valid user', async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login(standardUser.username, standardUser.password);
        await loginPage.verifyLoginSuccessful();
    });

    test('login with locked out user', async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login(lockedOutUser.username, lockedOutUser.password);
        await loginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    });

    test('login with problem user', async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login(problemUser.username, problemUser.password);
        await loginPage.verifyLoginSuccessful();
    });

});
