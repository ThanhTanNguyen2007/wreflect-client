export type templateHealthCheckType = {
  VN: {
    id: string;
    title: string;
    statements: {
      id: string;
      title: string;
      color: string;
      bad: string;
      good: string;
    }[];
  };
  EN: {
    id: string;
    title: string;
    statements: {
      id: string;
      title: string;
      color: string;
      bad: string;
      good: string;
    }[];
  };
};

export default {
  VN: [
    {
      id: '1',
      title: 'Khung Mẫu Health Check ',
      statements: [
        {
          id: '1',
          title: 'Mục Tiêu',
          color: 'orange',
          bad: 'Thấp nhất: Mục tiêu của nhóm không rõ ràng, cụ thể, thiếu tính cam kết',
          good: 'Cao nhất: Mục tiêu rõ ràng, cụ thể, có tính cam kết đầy đủ với tất cả thành viên trong nhóm',
        },
        {
          id: '2',
          title: 'Vai Trò',
          color: 'blue',
          bad: 'Thấp nhất: Vai trò và trách nhiệm của từng thành viên không được xác định rõ ràng và chia sẻ trong nhóm.',
          good: 'Cao nhất: Vai trò và trách nhiệm của từng thành viên được xác định rõ ràng với nhau.',
        },
        {
          id: '3',
          title: 'Sự cởi mở',
          color: 'purple',
          bad: 'Thấp nhất: Các thành viên đề phòng, thận trọng trong thảo luận nhóm và làm việc.',
          good: 'Cao nhất: Các thành viên thoải mái bày tỏ suy nghĩ, cảm xúc và ý tưởng trong thảo luận và làm việc',
        },
        {
          id: '4',
          title: 'Tin cậy',
          color: 'pink',
          bad: 'Thấp nhất: Các thành viên nghi ngờ, thiếu tin cậy nhau',
          good: 'Cao nhất: Các thành viên tin tưởng lẫn nhau',
        },
        {
          id: '5',
          title: 'Giải quyết xung đột, khác biệt',
          color: 'green',
          bad: 'Thấp nhất: Các thành viên bị động hoặc tránh để xảy ra xung đột, khác biệt trong khi làm việc',
          good: 'Cao nhất: Các thành viên chủ động đề cập đến các xung đột, khác biệt để tìm phương hướng giải quyết tốt nhất',
        },
        {
          id: '6',
          title: 'Sự phối hợp',
          color: 'lpink',
          bad: 'Thấp nhất: Các thành viên bị động đề nghị phối hợp hoặc nhận trợ giúp',
          good: 'Cao nhất:  Các thành viên chủ động và cảm thấy thoải mái khi phối hợp làm việc',
        },
        {
          id: '7',
          title: 'Sự tham gia',
          color: 'lblue',
          bad: 'Thấp nhất: Quá trình thảo luận, làm việc bị chi phối bởi một vài thành viên',
          good: 'Cao nhất: Tất cả thành viên đều tham gia chủ động, tích cực vào thảo luận và làm việc',
        },
        {
          id: '8',
          title: 'Đưa ra quyết định',
          color: 'orange',
          bad: 'Thấp nhất: Quá trình đưa ra quyết định của nhóm bị chi phối bởi một vài thành viên',
          good: 'Cao nhất: Tất cả thành viên đều được tham gia thực chất vào quá trình đưa ra quyết định',
        },
        {
          id: '9',
          title: 'Sự linh hoạt',
          color: 'blue',
          bad: 'Thấp nhất: Các thành viên bị bó buộc, cứng nhắc tuân thủ các quy định, nguyên tắc',
          good: 'Cao nhất: Các thành viên chủ động, linh hoạt điều chỉnh quy tắc làm việc để ứng phó với các tình huống phát sinh',
        },
        {
          id: '10',
          title: 'Sử dụng nguồn nhân lực',
          color: 'purple',
          bad: 'Thấp nhất: Khả năng, kiến thức, kinh nghiệm của từng cá nhân không được sử dụng tốt',
          good: 'Cao nhất: Khả năng, kiến thức, kinh nghiệm của từng cá nhân được sử dụng tối đa',
        },
        {
          id: '11',
          title: 'Sự vui vẻ',
          color: 'pink',
          bad: 'Thấp nhất: Các thành viên không hào hứng và vui vẻ khi làm việc ',
          good: 'Cao nhất:  Cả nhóm rất phấn khởi và rất vui khi làm việc với nhau',
        },
        {
          id: '12',
          title: 'Sự học hỏi',
          color: 'green',
          bad: 'Thấp nhất: Các thành viên không có thời gian để học hỏi cải thiện bất cứ điều gì.',
          good: 'Cao nhất:  Các thành viên học hỏi được rất nhiều điều thú vị',
        },
      ],
    },
  ],
  EN: [
    {
      id: '1',
      title: 'Health Check Template',
      statements: [
        {
          id: '1',
          title: 'Objective',
          color: 'orange',
          bad: 'Bad: Objectives are not clear, specific, lack of commitment',
          good: 'Good: Objectives are identified clearly, fully commited by all members.',
        },
        {
          id: '2',
          title: 'Roles & Responsibilities',
          color: 'blue',
          bad: 'Bad:  The roles and responsibilities of each team member are not identified and shared clearly.',
          good: 'Good: The roles and responsibilities of each team member are clear to everyone. ',
        },
        {
          id: '3',
          title: 'Openness',
          color: 'purple',
          bad: 'Bad: When it comes to conversation and work, members are cautious.',
          good: 'Good: In discussion and work, members are allowed to share their ideas, opinions, and thoughts.',
        },
        {
          id: '4',
          title: 'Trust',
          color: 'pink',
          bad: 'Bad:  Members have doubts and mistrust for one another.',
          good: 'Good: Members trust each other.',
        },
        {
          id: '5',
          title: 'Conflict & Differentiation',
          color: 'green',
          bad: 'Bad:  While working, members are either passive or try to avoid disputes and disagreements.',
          good: 'Good: Members openly discuss problems and disagreements in order to find the best solution.',
        },
        {
          id: '6',
          title: 'Collaboration',
          color: 'lpink',
          bad: 'Bad: Members passively request to cooperate or aid.',
          good: 'Good: Members actively coordinate to each other.',
        },
        {
          id: '7',
          title: 'Contribution',
          color: 'lblue',
          bad: 'Bad: A few members control the discussion and working process.',
          good: 'Good: In conversations and tasks, all members actively participate.',
        },
        {
          id: '8',
          title: 'Decisions',
          color: 'orange',
          bad: 'Bad: A few members control the decisions making.',
          good: 'Good: In decisions making, all members actively participate.',
        },
        {
          id: '9',
          title: 'Flexibility',
          color: 'blue',
          bad: 'Bad:  Members are forced to strict regulations and principles.',
          good: 'Good: Members flexibly adjust working rules to adapt to emergent conditions. ',
        },
        {
          id: '10',
          title: 'Resources',
          color: 'purple',
          bad: "Bad: Each individual's ability and experience are underutilized.",
          good: "Good:  Each individual's ability and experience are put to the best possible use.",
        },
        {
          id: '11',
          title: 'Fun',
          color: 'pink',
          bad: "Bad: We don't enjoy our work and look forward to coming to work.",
          good: 'Good: We love going to work and have great fun working together. ',
        },
        {
          id: '12',
          title: 'Learning',
          color: 'green',
          bad: 'Bad: We never have time to learn anything.',
          good: "Good: We're learning lots of interesting stuff all the time.",
        },
      ],
    },
  ],
};
