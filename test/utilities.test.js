const utilities = require('../src/utilities');
let bornTemp = {
    year: 1997,
    month: 10,
    day: 17,
    hour: 0,
    minute: 0,
    second: 0
};
let enrolledTemp = {
    year: 2016,
    month: 9,
    day: 5,
    hour: 20,
    minute: 20,
    second: 20
};
let newUser = {
    id: '110228',
    name: 'Johnny',
    surname: 'Guadagnini',
    born: bornTemp,
    enrolled: enrolledTemp,
    submissions: [],
    exam_eval: []
};
let enrolledTemp2 = {
    year: 2017,
    month: 10,
    day: 6,
    hour: 21,
    minute: 21,
    second: 21
};
let newUser2 = {
    id: '110229',
    name: 'Danis',
    surname: 'Ceballos',
    born: bornTemp,
    enrolled: enrolledTemp2,
    submissions: [],
    exam_eval: []
};

let newUserGroup = {
    id: 6,
    creator: newUser,
    name: 'SEII Dummy Class',
    users: [newUser2]
};

let dummySubmission1 = {
    id: 1,
    task_type: "open",
    question: {
        text: "What do you get if you perform 1 + 1 ?",
        possibilities: [],
        base_upload_url: "http://uploadhere.com/dummy/v1/"
    },
    answer: "25 I think",
    id_user: 12,
    id_exam: 1,
    completed: true,
    comment_peer: [
        "You did a great job dude",
        "You better go study philosophy",
        "Hi! My name's Peter"
    ],
    comment: "Almost... that's a shame: you were so close to the solution!",
    points: 2,
    earned_points: 0
};

let newTask = {
    id: '269',
    owner: newUser,
    task_type: 'open',
    question: {
        text: 'testCreateTask0',
        possibilities: [],
        base_upload_url: 'http://uploadhere.com/dummy/v1/'
    },
    points: '1'
};

describe('GENERIC utilities test cases', async () => {
    test('utilities module should be defined', () => {
        expect(utilities).toBeDefined();
    });
});

describe('[Task] utilities test cases', async () => {
    test('check isATask() with valid task', () => {
        expect(utilities.isATask(newTask)).toEqual(true);
    });
    test('check isATask() with valid task', () => {
        newTask.task_type = 'submit';
        expect(utilities.isATask(newTask)).toEqual(true);
    });
    test('check isATask() with valid task', () => {
        newTask.task_type = 'single_c';
        newTask.question.possibilities = ['0', '1'];
        expect(utilities.isATask(newTask)).toEqual(true);
    });
    test('check isATask() with invalid task question', () => {
        newTask.question.possibilities = [];
        expect(utilities.isATask(newTask)).toEqual(false);
    });
    test('check isATask() with invalid task field', () => {
        newTask.points = null;
        expect(utilities.isATask(newTask)).toEqual(false);
    });
    test('check isATask() with invalid task field', () => {
        newTask.points = null;
        newTask.owner = { id: 111111 };
        expect(utilities.isATask(newTask)).toEqual(false);
    });
    test('check isATask() with null task field', () => {
        expect(utilities.isATask(null)).toEqual(false);
    });
    test('check isATask() with null task field', () => {
        expect(utilities.isATaskBody(null)).toEqual(false);
    });
});

describe('[User] utilities test cases', async () => {
    test('check isAnArrayOfUser() with valid users', () => {
        expect(utilities.isAnArrayOfUser([newUser])).toEqual(true);
    });

    test('check isAnArrayOfUser() with invalid users', () => {
        expect(utilities.isAnArrayOfUser([{ id: 111111 }])).toEqual(false);
    });

    test('check isAnArrayOfUser() with empty array', () => {
        expect(utilities.isAnArrayOfUser([])).toEqual(false);
    });

    test('check isAnArrayOfUser() with null array', () => {
        expect(utilities.isAnArrayOfUser(null)).toEqual(false);
    });
});

describe('[UserGroup] utilities test cases', async () => {
    test('check isAUserGroupBody() with valid userGroups', () => {
        expect(utilities.isAUserGroupBody(newUserGroup)).toEqual(true);
    });

    test('check isAUserGroupBody() with invalid userGroups', () => {
        expect(utilities.isAUserGroupBody({ id: 111111 })).toEqual(false);
    });

    test('check isAUserGroupBody() with null as userGroups', () => {
        expect(utilities.isAUserGroupBody(null)).toEqual(false);
    });

    test('check isAnArrayOfUserGroups() with valid users', () => {
        expect(utilities.isAnArrayOfUserGroups([newUserGroup])).toEqual(true);
    });

    test('check isAnArrayOfUserGroups() with invalid users', () => {
        expect(utilities.isAnArrayOfUserGroups([{ id: 111111 }])).toEqual(false);
    });

    test('check isAnArrayOfUserGroups() with empty array', () => {
        expect(utilities.isAnArrayOfUserGroups([])).toEqual(false);
    });

    test('check isAnArrayOfUserGroups() with null array', () => {
        expect(utilities.isAnArrayOfUserGroups(null)).toEqual(false);
    });
});

describe('[Date] utilities test cases', async () => {
    test('check isAValidDate() with correct data', () => {
        expect(utilities.isAValidDate(bornTemp)).toEqual(true);
    });

    test('check isAValidDate() with invalid data', () => {
        let invalidBornTemp = bornTemp;
        invalidBornTemp.day = null;
        expect(utilities.isAValidDate(invalidBornTemp)).toEqual(false);
    });

    test('check isAValidDate() with null data', () => {
        expect(utilities.isAValidDate(null)).toEqual(false);
    });

    test('check convertMonth() with Jan', () => {
        expect(utilities.convertMonth('Jan')).toEqual(1);
    });

    test('check convertMonth() with Fev', () => {
        expect(utilities.convertMonth('Feb')).toEqual(2);
    });

    test('check convertMonth() with Mar', () => {
        expect(utilities.convertMonth('Mar')).toEqual(3);
    });

    test('check convertMonth() with Apr', () => {
        expect(utilities.convertMonth('Apr')).toEqual(4);
    });

    test('check convertMonth() with May', () => {
        expect(utilities.convertMonth('May')).toEqual(5);
    });

    test('check convertMonth() with Jun', () => {
        expect(utilities.convertMonth('Jun')).toEqual(6);
    });

    test('check convertMonth() with Jul', () => {
        expect(utilities.convertMonth('Jul')).toEqual(7);
    });

    test('check convertMonth() with Aug', () => {
        expect(utilities.convertMonth('Aug')).toEqual(8);
    });

    test('check convertMonth() with Sep', () => {
        expect(utilities.convertMonth('Sep')).toEqual(9);
    });

    test('check convertMonth() with Oct', () => {
        expect(utilities.convertMonth('Oct')).toEqual(10);
    });

    test('check convertMonth() with Nov', () => {
        expect(utilities.convertMonth('Nov')).toEqual(11);
    });

    test('check convertMonth() with Dic', () => {
        expect(utilities.convertMonth('Dic')).toEqual(12);
    });

    test('check convertMonth() with invalid month', () => {
        expect(utilities.convertMonth('hello')).toEqual(0);
    });

    test('check convertMonth() with number', () => {
        expect(utilities.convertMonth(11)).toEqual(0);
    });

    test('check convertMonth() with null data', () => {
        expect(utilities.convertMonth(null)).toEqual(0);
    });
    
    let date1 = {
        year: 1997,
        month: 9,
        day: 2,
        hour: 23,
        minute: 0,
        second: 0
    };
    date2 = jsonCopy(date1);

    test('check compareTwoDate() with equal date time values', () => {
        expect(utilities.compareTwoDate(date1, date2)).toEqual(0);
    });


    test('check compareTwoDate() with year1 > year 2', () => {
        date1.year++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(1);
    });

    test('check compareTwoDate() with month1 > month2', () => {
        date1.year--;
        date1.month++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(1);
    });

    test('check compareTwoDate() with day1 > day2', () => {
        date1.month--;
        date1.day++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(1);
    });

    test('check compareTwoDate() with hour1 > hour2', () => {
        date1.day--;
        date1.hour++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(1);
    });

    test('check compareTwoDate() with minute1 > minute2', () => {
        date1.hour--;
        date1.minute++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(1);
    });

    test('check compareTwoDate() with second1 > second2', () => {
        date1.minute--;
        date1.second++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(1);
    });

    test('check compareTwoDate() with year1 < year 2', () => {
        date1.second--;
        date2.year++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(2);
    });

    test('check compareTwoDate() with month1 < month2', () => {
        date2.year--;
        date2.month++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(2);
    });

    test('check compareTwoDate() with day1 < day2', () => {
        date2.month--;
        date2.day++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(2);
    });

    test('check compareTwoDate() with hour1 < hour2', () => {
        date2.day--;
        date2.hour++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(2);
    });

    test('check compareTwoDate() with minute1 < minute2', () => {
        date2.hour--;
        date2.minute++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(2);
    });

    test('check compareTwoDate() with second1 < second2', () => {
        date2.minute--;
        date2.second++;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(2);
    });

    test('check compareTwoDate() with date2 == null', () => {
        date2 = null;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(1);
    });

    test('check compareTwoDate() with date1 == null', () => {
        date2 = jsonCopy(date1);
        date1 = null;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(2);
    });

    test('check compareTwoDate() with date1 == null && date2==null', () => {
        date2 = null;
        date1 = null;
        expect(utilities.compareTwoDate(date1, date2)).toEqual(0);
    });
});

describe('[Sort comparison for users (alpha, enrol)] utilities test cases', async () => {

    test('check compareAlfa() with null data', () => {
        expect(utilities.compareAlfa(null, null)).toEqual(0);
    });

    test('check compareAlfa() with only one null parameter(1)', () => {
        expect(utilities.compareAlfa(null, newUser2)).toEqual(0);
    });

    test('check compareAlfa() with only one null parameter(2)', () => {
        expect(utilities.compareAlfa(newUser, null)).toEqual(0);
    });

    test('check compareAlfa() with valid parameter', () => {
        expect(utilities.compareAlfa(newUser, newUser2)).toEqual(1);
    });

    test('check compareAlfa() with valid parameter inverted', () => {
        expect(utilities.compareAlfa(newUser2, newUser)).toEqual(-1);
    });

    test('check compareAlfa() with parameter with null surname', () => {
        let userA = jsonCopy(newUser);
        userA.surname = null;
        let userB = jsonCopy(newUser2);
        userB.surname = null;
        expect(utilities.compareAlfa(userA, userB)).toEqual(0);
    });

    test('check compareAlfa() with parameter with only one user null surname(1)', () => {
        let userA = jsonCopy(newUser);
        userA.surname = null;
        let userB = jsonCopy(newUser2);
        expect(utilities.compareAlfa(userA, userB)).toEqual(1);
    });

    test('check compareAlfa() with parameter with only one user null surname(2)', () => {
        let userA = jsonCopy(newUser);
        let userB = jsonCopy(newUser2);
        userB.surname = null;
        expect(utilities.compareAlfa(userA, userB)).toEqual(-1);
    });

    test('check compareAlfa() with parameter with equal surname(1)', () => {
        let userA = jsonCopy(newUser);
        userA.surname = 'test';
        let userB = jsonCopy(newUser2);
        userB.surname = 'test';
        expect(utilities.compareAlfa(userA, userB)).toEqual(1);
    });

    test('check compareAlfa() with parameter with equal surname(2)', () => {
        let userA = jsonCopy(newUser);
        userA.surname = 'test';
        let userB = jsonCopy(newUser2);
        userB.surname = 'test';
        expect(utilities.compareAlfa(userB, userA)).toEqual(-1);
    });

    test('check compareAlfa() with parameter with equal surname and null name', () => {
        let userA = jsonCopy(newUser);
        userA.surname = 'test';
        userA.name = null;
        let userB = jsonCopy(newUser2);
        userB.surname = 'test';
        userB.name = null;
        expect(utilities.compareAlfa(userA, userB)).toEqual(0);
    });

    test('check compareAlfa() with parameter with equal surname, and only one name as null (1)', () => {
        let userA = jsonCopy(newUser);
        userA.surname = 'test';
        userA.name = null;
        let userB = jsonCopy(newUser2);
        userB.surname = 'test';
        expect(utilities.compareAlfa(userA, userB)).toEqual(1);
    });

    test('check compareAlfa() with parameter with equal surname, and only one name as null (2)', () => {
        let userA = jsonCopy(newUser);
        userA.surname = 'test';
        let userB = jsonCopy(newUser2);
        userB.surname = 'test';
        userB.name = null;
        expect(utilities.compareAlfa(userA, userB)).toEqual(-1);
    });

    test('check compareAlfa() with parameter with equal surname and name', () => {
        let userA = jsonCopy(newUser);
        userA.surname = 'test';
        userA.name = 'test';
        let userB = jsonCopy(newUser2);
        userB.surname = 'test';
        userB.name = 'test';
        expect(utilities.compareAlfa(userB, userA)).toEqual(0);
    });

    test('check compareEnrol() with null data', () => {
        expect(utilities.compareEnrol(null, null)).toEqual(0);
    });

    test('check compareEnrol() with only one null parameter (1)', () => {
        let userA = jsonCopy(newUser);
        let userB = jsonCopy(newUser2);
        expect(utilities.compareEnrol(null, userB)).toEqual(0);
    });

    test('check compareEnrol() with only one null parameter (2)', () => {
        let userA = jsonCopy(newUser);
        let userB = jsonCopy(newUser2);
        expect(utilities.compareEnrol(userA, null)).toEqual(0);
    });

    test('check compareEnrol() with complete data', () => {
        let userA = jsonCopy(newUser);
        let userB = jsonCopy(newUser2);
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with complete data, inverted', () => {
        let userA = jsonCopy(newUser);
        let userB = jsonCopy(newUser2);
        expect(utilities.compareEnrol(userB, userA)).toEqual(1);
    });

    test('check compareEnrol() with enrolled as null', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(0);
    });

    test('check compareEnrol() with only one enrolled as null (1)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled = null;
        let userB = jsonCopy(newUser2);
        expect(utilities.compareEnrol(userA, userB)).toEqual(1);
    });

    test('check compareEnrol() with only one enrolled as null (2)', () => {
        let userA = jsonCopy(newUser);
        let userB = jsonCopy(newUser2);
        userB.enrolled = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with year as null', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(0);
    });


    test('check compareEnrol() with only one year as null (1)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = null;
        let userB = jsonCopy(newUser2);
        expect(utilities.compareEnrol(userA, userB)).toEqual(1);
    });

    test('check compareEnrol() with only one year as null (2)', () => {
        let userA = jsonCopy(newUser);
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year, inverted', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        expect(utilities.compareEnrol(userB, userA)).toEqual(1);
    });

    test('check compareEnrol() with equal year and month as null', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(0);
    });

    test('check compareEnrol() with equal year, with one only month as null (1)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(1);
    });

    test('check compareEnrol() with equal year, with one only month as null (2)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year and month', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year and month, inverted', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        expect(utilities.compareEnrol(userB, userA)).toEqual(1);
    });

    test('check compareEnrol() with equal year, month and day as null', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(0);
    });

    test('check compareEnrol() with equal year and month, with one only day as null (1)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(1);
    });

    test('check compareEnrol() with equal year and month, with one only day as null (2)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year, month and day', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year, month and day, inverted', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        expect(utilities.compareEnrol(userB, userA)).toEqual(1);
    });

    test('check compareEnrol() with equal year, month, day and hour as null', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(0);
    });

    test('check compareEnrol() with equal year, month and day, with one only hour as null (1)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(1);
    });

    test('check compareEnrol() with equal year, month and day, with one only hour as null (2)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year, month, day and hour', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year, month, day and hour, inverted', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        expect(utilities.compareEnrol(userB, userA)).toEqual(1);
    });

    test('check compareEnrol() with equal year, month, day, hour and minute as null', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        userA.enrolled.minute = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        userB.enrolled.minute = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(0);
    });

    test('check compareEnrol() with equal year, month, day and hour, with one only minute as null (1)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        userA.enrolled.minute = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(1);
    });

    test('check compareEnrol() with equal year, month, day and hour, with one only minute as null (2)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        userB.enrolled.minute = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year, month, day, hour and minute', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        userA.enrolled.minute = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        userB.enrolled.minute = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year, month, day and hour, inverted', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        userA.enrolled.minute = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        userB.enrolled.minute = 1;
        expect(utilities.compareEnrol(userB, userA)).toEqual(1);
    });

    test('check compareEnrol() with equal year, month, day, hour, minute and second as null', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        userA.enrolled.minute = 1;
        userA.enrolled.second = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        userB.enrolled.minute = 1;
        userB.enrolled.second = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(0);
    });

    test('check compareEnrol() with equal year, month, day, hour, minute and with one only second as null (1)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        userA.enrolled.minute = 1;
        userA.enrolled.second = null;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        userB.enrolled.minute = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(1);
    });

    test('check compareEnrol() with equal year, month, day, hour, minute and with one only second as null (2)', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        userA.enrolled.minute = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        userB.enrolled.minute = 1;
        userB.enrolled.second = null;
        expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
    });

    test('check compareEnrol() with equal year, month, day, hour, minute and second', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        userA.enrolled.minute = 1;
        userA.enrolled.second = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        userB.enrolled.minute = 1;
        userB.enrolled.second = 1;
        expect(utilities.compareEnrol(userA, userB)).toEqual(0);
    });

    test('check compareEnrol() with equal year, month, day, hour, minute and second ,inverted', () => {
        let userA = jsonCopy(newUser);
        userA.enrolled.year = 1;
        userA.enrolled.month = 1;
        userA.enrolled.day = 1;
        userA.enrolled.hour = 1;
        userA.enrolled.minute = 1;
        userA.enrolled.second = 1;
        let userB = jsonCopy(newUser2);
        userB.enrolled.year = 1;
        userB.enrolled.month = 1;
        userB.enrolled.day = 1;
        userB.enrolled.hour = 1;
        userB.enrolled.minute = 1;
        userB.enrolled.second = 1;
        expect(utilities.compareEnrol(userB, userA)).toEqual(0);
    });
});

describe('[Submission] utilities test cases', async () => {
    test('check isASubmission() with valid submission', () => {
        expect(utilities.isASubmission(dummySubmission1)).toEqual(true);
    });

    test('check isASubmission() with null as submission', () => {
        expect(utilities.isASubmission(null)).toEqual(false);
    });

    test('check isASubmission() with invalid submission', () => {
        let subm = jsonCopy(dummySubmission1);
        subm.id_user = null;
        expect(utilities.isASubmission(subm)).toEqual(false);
    });

    test('check isASubmissionAnswer() with valid submission', () => {
        let subm = jsonCopy(dummySubmission1);
        subm.answer = "test";
        expect(utilities.isASubmissionAnswer(dummySubmission1)).toEqual(true);
    });

    test('check isASubmissionAnswer() with invalid submission answer', () => {
        let subm = jsonCopy(dummySubmission1);
        subm.answer = null;
        expect(utilities.isASubmissionAnswer(subm)).toEqual(false);
    });

    test('check isASubmissionAnswer() with null as submission', () => {
        expect(utilities.isASubmissionAnswer(null)).toEqual(false);
    });

    test('check isASubmissionEvaluated() with invalid submission because there is no points defined', () => {
        let subm = jsonCopy(dummySubmission1);
        subm.earned_points = 10;
        subm.points = null;
        subm.comment = "bravo";
        expect(utilities.isASubmissionEvaluated(subm)).toEqual(false);
    });

    test('check isASubmissionEvaluated() with invalid submission evaluated', () => {
        let subm = jsonCopy(dummySubmission1);
        subm.earned_points = null;
        subm.comment = null;
        expect(utilities.isASubmissionEvaluated(subm)).toEqual(false);
    });

    test('check isASubmissionEvaluated() with submission evaluated, but not answered', () => {
        let subm = jsonCopy(dummySubmission1);
        subm.answer = null;
        subm.earned_points = 10;
        subm.comment = "bravo";
        expect(utilities.isASubmissionEvaluated(subm)).toEqual(false);
    });

    test('check isASubmissionEvaluated() with submission evaluated with earned points == points', () => {
        let subm = jsonCopy(dummySubmission1);
        subm.answer = 'I\'m daniel san';
        subm.earned_points = 10;
        subm.points = 10;
        subm.comment = "bravo";
        expect(utilities.isASubmissionEvaluated(subm)).toEqual(true);
    });

    test('check isASubmissionEvaluated() with submission evaluated but with earned points > points', () => {
        let subm = jsonCopy(dummySubmission1);
        subm.answer = 'I\'m daniel san';
        subm.earned_points = 10;
        subm.points = 9;
        subm.comment = "bravo";
        expect(utilities.isASubmissionEvaluated(subm)).toEqual(false);
    });

    test('check isASubmissionEvaluated() with submission evaluated, but comment equals null', () => {
        let subm = jsonCopy(dummySubmission1);
        subm.answer = "ciao";
        subm.earned_points = 10;
        subm.comment = null;
        expect(utilities.isASubmissionEvaluated(subm)).toEqual(false);
    });

    test('check isASubmissionEvaluated() with null as submission', () => {
        expect(utilities.isASubmissionEvaluated(null)).toEqual(false);
    });

    test('check isASubmissionEvaluated() with invalid submission', () => {
        expect(utilities.isASubmissionEvaluated([{ id: 111111 }])).toEqual(false);
    });

    test('check isAnArrayOfSubmission() with valid submission', () => {
        expect(utilities.isAnArrayOfSubmission([dummySubmission1])).toEqual(true);
    });

    test('check isAnArrayOfSubmission() with empty array', () => {
        expect(utilities.isAnArrayOfSubmission([])).toEqual(false);
    });

    test('check isAnArrayOfSubmission() with null as submission', () => {
        expect(utilities.isAnArrayOfSubmission(null)).toEqual(false);
    });

    test('check isAnArrayOfSubmission() with invalid submission', () => {
        expect(utilities.isAnArrayOfSubmission([{
            id: 111111,
            gelato: 'cioccolata',
            boffo: 'marcolino'
        }])).toEqual(false);
    });
});

function jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
}
