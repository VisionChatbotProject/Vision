import { ELanguage } from "src/app/core/models/base";
import { IChapter } from "src/app/core/models/chapter";
import { ICourse } from "src/app/core/models/course";
import { IQuestionnaire } from "src/app/core/models/questionnaire";
import { IInvite } from "src/app/core/models/invite";
import {
  IOrganization,
  IOrganizationBase,
} from "src/app/core/models/organization";
import {
  IOrganizationMembership,
  IOrganizationMembershipBase,
} from "src/app/core/models/organization_membership";
import {
  IOrganizationRole,
  IOrganizationRoleBase,
} from "src/app/core/models/organization_role";
import { IPerson } from "src/app/core/models/person";
import { IQuestion } from "src/app/core/models/question";
import { ISlide } from "src/app/core/models/slide";
import { IAnswerOption } from "src/app/core/models/answer_options";
import { IIntent } from "src/app/intent/models/intent.model";
import { IExam } from "src/app/exam/models/exam.model";
import { ITask } from "src/app/task/models/task.model";

export const dummyOrganizationBase: IOrganizationBase = {
  language: ELanguage.eEnglish,
  name: "org1",
  url: "https://www.org1.com",
};

export const dummyOrganizationMembershipBase: IOrganizationMembershipBase = {
  firstName: "john",
  lastName: "doe",
  email: "john.doe@test.com",
  role: 1,
};

export const dummyOrganizationRoleBase: IOrganizationRoleBase = {
  name: "Administrator Light",
  canModifyOrganizationDetails: true,
  canModifyOrganizationRoles: true,
  canModifyOrganizationMembers: true,
  canModifyOrganizationUnitDetails: false,
  canModifyOrganizationUnitRoles: false,
  canModifyOrganizationUnitMembers: false,
  canManageCourses: true,
};

export const dummyOrganization: IOrganization = {
  id: 1,
  name: "org1",
  url: "https://www.org1.com",
  language: ELanguage.eEnglish,
  createdBy: 1,
};

export const dummyOrganizationRoles: IOrganizationRole[] = [
  {
    id: 1,
    name: "Administrator",
    modifiable: false,
    canModifyOrganizationDetails: true,
    canModifyOrganizationRoles: true,
    canModifyOrganizationMembers: true,
    canModifyOrganizationUnitDetails: true,
    canModifyOrganizationUnitRoles: true,
    canModifyOrganizationUnitMembers: true,
    canManageCourses: true,
  },
  {
    id: 2,
    name: "Member",
    modifiable: false,
    canModifyOrganizationDetails: false,
    canModifyOrganizationRoles: false,
    canModifyOrganizationMembers: false,
    canModifyOrganizationUnitDetails: false,
    canModifyOrganizationUnitRoles: false,
    canModifyOrganizationUnitMembers: false,
    canManageCourses: false,
  },
  {
    id: 3,
    name: "Test Role",
    modifiable: true,
    canModifyOrganizationDetails: false,
    canModifyOrganizationRoles: false,
    canModifyOrganizationMembers: false,
    canModifyOrganizationUnitDetails: false,
    canModifyOrganizationUnitRoles: false,
    canModifyOrganizationUnitMembers: false,
    canManageCourses: false,
  },
];

export const dummyOrganizations: IOrganization[] = [
  {
    id: 1,
    name: "org1",
    url: "https://www.org1.com",
    language: ELanguage.eEnglish,
    createdBy: 1,
  },
  {
    id: 2,
    name: "org2",
    url: "https://www.org2.com",
    language: ELanguage.eGerman,
    createdBy: 101,
  },
];

export const dummyOrganizationMemberships: IOrganizationMembership[] = [
  {
    id: 1,
    firstName: "john",
    lastName: "doe",
    email: "john.doe@test.com",
    role: 1,
    virtual: false,
  },
  {
    id: 2,
    firstName: "mary",
    lastName: "may",
    email: "mary.may@test.com",
    role: 1,
    virtual: true,
  },
];

export const dummyOrganizationMembership: IOrganizationMembership = {
  id: 1,
  firstName: "john",
  lastName: "doe",
  email: "john.doe@test.com",
  role: 1,
  virtual: false,
};

export const dummyCourse: ICourse = {
  id: 1,
  createdBy: 1,
  longDescription: "a very long description",
  shortDescription: "a short description",
  name: "course",
  image: "http://testserver/serve/test.png",
  modifiedAt: new Date(2021, 1, 5, 0, 0, 0),
  teacherName: "test teacher 1",
  teacherEmail: "teach@smartauthoring.com",
  courseBeginDate: "2023-02-05T09:00",
  courseEndDate: "2023-02-11T09:00",
  materials: "some materials",
  ressources: "https://smartauthoring.com/test.pdf",
};

export const dummyCourses: ICourse[] = [
  {
    ...dummyCourse,
  },
  {
    id: 2,
    createdBy: 1,
    longDescription: "a very long description",
    shortDescription: "a short description",
    name: "course 2",
    image: "",
    modifiedAt: new Date(2016, 1, 5, 0, 0, 0),
    teacherName: "test teacher 2",
    teacherEmail: "teach@smartauthoring.com",
    courseBeginDate: "2023-02-05T09:00",
    courseEndDate: "2023-02-12T09:00",
    materials: "some materials",
    ressources: "https://smartauthoring.com/test.pdf",
  },
  {
    id: 3,
    createdBy: 1,
    longDescription: "a very long description",
    shortDescription: "a short description",
    name: "course 3",
    image: "",
    modifiedAt: new Date(2021, 1, 5, 0, 0, 0),
    teacherName: "test teacher 3",
    teacherEmail: "teach@smartauthoring.com",
    courseBeginDate: "2023-02-05T09:00",
    courseEndDate: "2023-02-13T09:00",
    materials: "some materials",
    ressources: "https://smartauthoring.com/test.pdf",
  },
];

export const dummyChapter: IChapter = {
  id: 1,
  longDescription: "a very long description",
  shortDescription: "a short description",
  title: "chapter title",
  course: 1,
  order: 0
};

export const dummyChapters: IChapter[] = [
  {
    id: 1,
    longDescription: "a very long description",
    shortDescription: "a short description",
    title: "chapter title",
    course: 1,
    order: 0,
  },
  {
    id: 2,
    longDescription: "a very long description",
    shortDescription: "a short description",
    title: "chapter title 2",
    course: 2,
    order: 1,
  },
];

export const dummySlide: ISlide = {
  id: 1,
  title: "<slide 1 title>",
  content: "http://testServer.com/dummySlide.html",
  order: 0
};

export const dummySlides: ISlide[] = [
  {
    id: 1,
    title: "<sub-chapter 1 title>",
    content: "http://testServer.com/slide1.html",
    order: 1
  },

  {
    id: 2,
    title: "<slide 2 title>",
    content: "http://testServer.com/slide2.html",
    order: 2
  },
];

export const dummyQuestionnaire: IQuestionnaire = {
  id: 1,
  course: 1,
  title: "Questionnaire",
};

export const dummyQuestionnaires: IQuestionnaire[] = [
  {
    id: 1,
    course: 1,
    title: "Questionnaire",
  },
  {
    id: 2,
    course: 1,
    title: "Questionnaire",
  },
];

export const dummyQuestion: IQuestion = {
  id: 1,
  title: "<question 1 title>",
  asset: "http://testServer.com/dummyQuestion.html",
  questionnaire: 1,
  text: "<question 1 description>",
  createdAt: "",
  createdBy: 0,
  resourcetype: "ChoiceQuestion",
  updatedAt: "",
  updatedBy: 0,
};

export const dummyQuestions: IQuestion[] = [
  {
    id: 1,
    title: "<question 1 title>",
    asset: "http://testServer.com/dummyQuestion.html",
    questionnaire: 1,
    text: "<question 1 description>",
    createdAt: "",
    createdBy: 0,
    resourcetype: "ChoiceQuestion",
    updatedAt: "",
    updatedBy: 0,
  },

  {
    id: 2,
    title: "<question 2 title>",
    asset: "http://testServer.com/dummyQuestion.html",
    questionnaire: 1,
    text: "<question 2 description>",
    createdAt: "",
    createdBy: 0,
    resourcetype: "ChoiceQuestion",
    updatedAt: "",
    updatedBy: 0,
  },
];

export const dummyAnswerOption: IAnswerOption = {
  id: 1,
  asset: "http://testServer.com/dummyAnswerOption.html",
  resourcetype: "AnswerOption",
  question: 1,
  text: "<answer option 1 description>",
  correctAnswer: false,
  createdAt: "",
  createdBy: 0,
  updatedAt: "",
  updatedBy: 0,
};

export const dummyAnswerOptions: IAnswerOption[] = [
  {
    id: 1,
    asset: "http://testServer.com/dummyAnswerOption.html",
    resourcetype: "AnswerOption",
    question: 1,
    text: "<question 1 description>",
    createdAt: "",
    createdBy: 0,
    updatedAt: "",
    updatedBy: 0,
    correctAnswer: false,
  },

  {
    id: 2,
    asset: "http://testServer.com/dummyAnswerOption.html",
    resourcetype: "AnswerOption",
    question: 1,
    text: "<question 2 description>",
    createdAt: "",
    createdBy: 0,
    updatedAt: "",
    updatedBy: 0,
    correctAnswer: false,
  },
];

export const dummyPerson: IPerson[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
  },
  {
    id: 2,
    firstName: "Mary",
    lastName: "Jay",
  },
];

export const dummyInvites: IInvite[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john-doe@test.com",
    code: "XYZ12",
    used: false,
    role: 1,
    person: dummyPerson[0],
  },
  {
    id: 2,
    firstName: "Mary",
    lastName: "Jay",
    email: "mary-jay@test.com",
    code: "XYZ34",
    used: false,
    role: 1,
    person: dummyPerson[1],
  },
  {
    id: 3,
    firstName: "I Used",
    lastName: "My Invite",
    email: "test@localhost",
    code: "XYZ56",
    used: true,
    role: 2,
    person: dummyPerson[1],
  },
];

export const dummyIntents: IIntent[] = [
  {
    id: 1,
    intents: [
      'Dummy 1',
      'Dummy 2'
    ],
    isQuestion: false,
    name: 'Intent 1',
    response: 'Response 1',
    chapter: null
  },
  {
    id: 2,
    intents: [
      'Dummy 3',
      'Dummy 4'
    ],
    isQuestion: true,
    name: 'Intent 2',
    response: 'Response 2',
    chapter: null
  },
];

export const dummyExams: IExam[] = [
  {
    id: 1,
    name: 'Exam 1',
    description: 'Description 1',
    observation: 'Observation 1',
    date: "2023-02-13T09:00",
    isActive: true,
  },
  {
    id: 2,
    name: 'Exam 2',
    description: 'Description 2',
    observation: 'Observation 2',
    date: "2023-03-13T09:00",
    isActive: false,
  },
];

export const dummyTasks: ITask[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    resources: 'Resources 1',
    deadline: "2023-02-13T09:00",
    isActive: true,
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    resources: 'Resources 2',
    deadline: "2023-03-13T09:00",
    isActive: false,
  },
];
