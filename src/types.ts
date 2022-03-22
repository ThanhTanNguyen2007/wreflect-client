export type Teams = {
  data: [Team];
  total: number;
};

export type Team = {
  id: string;
  name: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  picture: string;
  isPublic: boolean;
  description: string | null;
  status: TeamStatus;
  members: Member[];
  boards: Board[];
};

export type HealthCheck = {
  id: string;
  teamId: string;
  boardId: string;
  templateId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isAnonymous: boolean;
  isCustom: boolean;
  status: StatusHealthCheck;
  board: Board;
  team: Team;
  memberAnswers: [MemberAnswer];
  memberComments: [MemberComment];
};

export type MemberAnswer = {
  id: string;
  templateId: string;
  healthCheckId: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  answers: [Answer];
  healthCheck: HealthCheck | null;
  user: User;
};

export type MemberComment = {
  id: string;
  templateId: string;
  healthCheckId: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  questionId: string;
  text: string;
  user: User;
  healthCheck: HealthCheck | null;
};

export type Answer = {
  id: string;
  questionId: string;
  value: string;
  memberAnswersId: string | null;
};

export type Board = {
  id: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublic: boolean;
  isLocked: boolean;
  disableDownVote: boolean;
  disableUpVote: boolean;
  isAnonymous: boolean;
  votesLimit: number;
  title: string;
  timerInProgress: boolean;
  type: BoardType;
  currentPhase: PhaseType;
  endTime: string;
  columns: Column[];
};

export type Column = {
  id: string;
  color: string;
  title: string;
  isActive: boolean;
  boardId: string;
  position: number;
  board: Board;
  opinions: Opinion[];
};

export type Opinion = {
  id: string;
  columnId: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  upVote: string[];
  downVote: string[];
  updatedBy: string;
  isAction: boolean;
  isBookmarked: boolean;
  responsible: string;
  mergedAuthors: string[];
  color: string;
  position: number;
  status: OpinionStatus;
  column: Column;
  remarks: Remark[];
  author: Member;
};

export type Remark = {
  id: string;
  authorId: string;
  opinionId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  opinion: Opinion;
  author: Member;
};

export type Member = {
  id: string;
  userId: string;
  teamId: string;
  isOwner: boolean;
  isSuperOwner: boolean;
  isPendingInvitation: boolean;
  isGuess: boolean;
  meetingNote: string;
  invitedBy: string | null;
  joinedAt: Date;

  user: User;
  team: Team;
  opinions: [Opinion];
  remarks: [Remark];
  assessments: [Assessment];
  memberComments: [MemberComment];
  memberAnswers: [MemberAnswer];
};

export type UserProfile = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export type Session = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  data: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Assessment = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  teamId: string;
  ownerId: string;
  status: AssessmentStatus;
  team: Team;
  ownerMember: Member;
  assessmentOnCriteriaList: AssessmentOnCriteria[];
};

export type AssessmentOnCriteria = {
  assessmentId: string;
  criteriaId: string;
  createdAt: Date;
  createdBy: string;
  assessment: Assessment;
  criteria: Criteria;
};

export type Criteria = {
  id: string;
  name: string;
  description: string;
  assessmentOnCriteriaList: AssessmentOnCriteria[];
};

export type MemberStatus = 'PENDING_INVITATION' | 'JOINED';
export type UserOnlineStatus = 'ONLINE' | 'OFFLINE';
export type TeamStatus = 'DOING' | 'DONE';
export type UserStatus = 'ONLINE' | 'OFFLINE';
export type Gender = 'UNSPECIFIED' | 'MALE' | 'FEMALE';
export type OpinionStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'REJECTED';
export type BoardType = 'DEFAULT' | 'PHASE';
export type PhaseType = 'REFLECT' | 'GROUP' | 'VOTES' | 'DISCUSS';
export type StatusHealthCheck = 'OPEN' | 'CLOSED';
export type AssessmentStatus = 'PLANNED' | 'DOING' | 'COMPLETE' | 'REOPENED';

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  userStatus: UserStatus;
  nickname: string;
  picture: string;
  gender: Gender;
  workplace: string | null;
  address: string | null;
  school: string | null;
  introduction: string | null;
  talents: string | null;
  interests: string | null;
};
