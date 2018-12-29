export const mockQuestionsResponse = {
  status: "success",
  message: "all questions retrieved successfully",
  questions: [
      {
          "id": 4,
          "title": "Why do we celebrate when we win?",
          "body": "What is the point of celebrating when we win? Is it cause we feel happy? is it cause we don't know how to act when we feel happy. I am coming from a place of winning all the time and I'm not sure what to do about this, I feel like I 'NEED' to celebrate. This doesn't feel normal to me. I don't want to celebrate because I want to, it feels more like society has programmed me to NEED to celebrate. Why can't I just go about my day normally?",
          "username": "Darthrighteous",
          "created_at": "2018-12-26T08:26:53.488Z",
          "score": 0,
          "answer_count": 0,
          "comment_count": 0,
          "accepted_answer": null,
          "answers": [
              {
                  "id": null,
                  "body": null
              }
          ]
      },
      {
          "id": 2,
          "title": "Question 2",
          "body": "Question body two",
          "username": "dddark",
          "created_at": "2018-12-24T15:35:56.347Z",
          "score": 1,
          "answer_count": 1,
          "comment_count": 0,
          "accepted_answer": null,
          "answers": [
              {
                  "id": 2,
                  "body": "Answer body two"
              }
          ]
      },
      {
          "id": 3,
          "title": "Question 3",
          "body": "Question body three",
          "username": "coachee",
          "created_at": "2018-12-24T15:35:56.347Z",
          "score": 0,
          "answer_count": 0,
          "comment_count": 0,
          "accepted_answer": null,
          "answers": [
              {
                  "id": null,
                  "body": null
              }
          ]
      },
      {
          "id": 1,
          "title": "Question 1",
          "body": "Question body one",
          "username": "skerrigan",
          "created_at": "2018-12-24T15:35:56.347Z",
          "score": 0,
          "answer_count": 3,
          "comment_count": 1,
          "accepted_answer": null,
          "answers": [
              {
                  "id": 3,
                  "body": "Answer body three"
              },
              {
                  "id": 4,
                  "body": "Answer body four"
              },
              {
                  "id": 1,
                  "body": "Answer body one"
              }
          ]
      }
  ]
};

export const mockSingleQuestionResponse = {
    "status": "success",
    "message": "one question retrieved successfully",
    "question": {
        "id": 4,
        "title": "Why do we celebrate when we win?",
        "body": "What is the point of celebrating when we win? Is it cause we feel happy? is it cause we don't know how to act when we feel happy. I am coming from a place of winning all the time and I'm not sure what to do about this, I feel like I 'NEED' to celebrate. This doesn't feel normal to me. I don't want to celebrate because I want to, it feels more like society has programmed me to NEED to celebrate. Why can't I just go about my day normally?",
        "username": "Darthrighteous",
        "created_at": "2018-12-26T08:26:53.488Z",
        "score": 0,
        "answer_count": 3,
        "comment_count": 8,
        "accepted_answer": null
    },
    "comments": [
        {
            "id": 3,
            "question_id": 4,
            "answer_id": null,
            "body": "this is a very serious question, please answer if you know",
            "username": "Darthrighteous",
            "created_at": "2018-12-28T14:30:41.804Z"
        },
        {
            "id": 4,
            "question_id": 4,
            "answer_id": null,
            "body": "This is a new comment that I am posting for the sake of it",
            "username": "Darthrighteous",
            "created_at": "2018-12-28T21:57:16.926Z"
        }
    ],
    "answers": [
        {
            "id": 5,
            "question_id": 4,
            "body": "Well, we celebrate winning cause it makes us feel good. You shouldn't worry about why we do it. All that matters is your happiness whether you've been programmed to do it or not.",
            "username": "Darthrighteous",
            "created_at": "2018-12-29T13:15:20.577Z",
            "score": 0,
            "comment_count": 0,
            "accepted": false,
            "commentlist": [
                {
                    "id": 1,
                    "body": "test comment",
                    "username": "tester",
                    "created_at": "cheeeee"
                }
            ]
        },
        {
            "id": 6,
            "question_id": 4,
            "body": "Duplicated. Well, we celebrate winning cause it makes us feel good. You shouldn't worry about why we do it. All that matters is your happiness whether you've been programmed to do it or not.",
            "username": "Darthrighteous",
            "created_at": "2018-12-29T13:16:51.334Z",
            "score": 0,
            "comment_count": 0,
            "accepted": true,
            "commentlist": [
                {
                    "id": null,
                    "body": null,
                    "username": null,
                    "created_at": null
                }
            ]
        }
    ]
};
