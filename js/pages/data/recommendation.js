const relatedMajors = {
    "유학동양학과": ["한문학과", "철학과"],
    "국어국문학과": ["한문학과", "중어중문학과"],
    "영어영문학과": ["프랑스어문학과", "독어독문학과", "러시아어문학과"],
    "프랑스어문학과": ["영어영문학과", "독어독문학과"],
    "중어중문학과": ["국어국문학과", "한문학과"],
    "독어독문학과": ["프랑스어문학과", "영어영문학과"],
    "러시아어문학과": ["독어독문학과", "프랑스어문학과"],
    "한문학과": ["국어국문학과", "유학·동양학과"],
    "사학과": ["철학과"],
    "철학과": ["유학·동양학과", "사학과"],
    "문헌정보학과": ["데이터사이언스융합전공"],
    "행정학과": ["정치외교학과", "사회학과"],
    "정치외교학과": ["행정학과", "글로벌리더학부"],
    "미디어커뮤니케이션학과": ["사회학과", "소비자학과"],
    "사회학과": ["행정학과", "미디어커뮤니케이션학과"],
    "사회복지학과": ["아동·청소년학과", "소비자학과"],
    "심리학과": ["아동·청소년학과"],
    "소비자학과": ["미디어커뮤니케이션학과", "사회복지학과"],
    "아동청소년학과": ["심리학과", "사회복지학과"],
    "글로벌리더학부": ["정치외교학과"],
    "경제학과": ["글로벌경제학과", "경영학과"],
    "통계학과": ["데이터사이언스융합전공", "인공지능융합전공"],
    "글로벌경제학과": ["경제학과", "글로벌경영학과"],
    "경영학과": ["경제학과", "글로벌경영학과"],
    "글로벌경영학과": ["글로벌경제학과", "경영학과"],
    "교육학과": ["아동·청소년학과", "심리학과"],
    "한문교육과": ["한문학과"],
    "수학교육과": ["수학과"],
    "컴퓨터교육과": ["소프트웨어학과"],
    "미술학과": ["디자인학과"],
    "디자인학과": ["미술학과", "의상학과"],
    "무용학과": ["연기예술학과"],
    "영상학과": ["연기예술학과"],
    "연기예술학과": ["무용학과", "영상학과"],
    "의상학과": ["디자인학과"],
    "생명과학과": ["식품생명공학과"],
    "수학과": ["수학교육과", "물리학과"],
    "물리학과": ["수학과", "화학과"],
    "화학과": ["물리학과"],
    "전자전기공학부": ["반도체시스템공학과", "반도체융합공학과"],
    "반도체시스템공학과": ["전자전기공학부", "반도체융합공학과"],
    "소재부품융합공학과": ["신소재공학부"],
    "반도체융합공학과": ["전자전기공학부", "반도체시스템공학과"],
    "차세대반도체공학연계전공": ["반도체융합공학과"],
    "소프트웨어학과": ["컴퓨터교육과"],
    "글로벌융합학부": ["글로벌리더학부"],
    "데이터사이언스융합전공": ["통계학과", "문헌정보학과"],
    "인공지능융합전공": ["데이터사이언스융합전공"],
    "컬처앤테크놀로지융합전공": ["영상학과"],
    "지능형소프트웨어학과": ["소프트웨어학과"],
    "화학공학/고분자공학부": ["신소재공학부"],
    "신소재공학부": ["소재부품융합공학과", "화학공학/고분자공학부"],
    "기계공학부": ["건설환경공학부"],
    "건설환경공학부": ["기계공학부"],
    "시스템경영공학과": ["경영학과"],
    "건축학과": ["나노공학과"],
    "나노공학과": ["건축학과"],
    "약학과": ["생명과학과"],
    "식품생명공학과": ["생명과학과"],
    "바이오메카트로닉스학과": ["융합생명공학과"],
    "융합생명공학과": ["바이오메카트로닉스학과"],
    "스포츠과학과": ["무용학과"],
    "의학과": ["약학과"],
    "글로벌바이오메디컬공학과": ["생명과학과", "융합생명공학과"],
    "응용AI융합학부": ["인공지능융합전공"],
    "에너지학과": ["화학공학/고분자공학부"]
  };
  
  export default relatedMajors;
  