let coursesData = [
  {
    courseID: "C001",
    title: "Fearless Belive",
    introduction:
      "Practical mindfulness meditation course showing the method how to increase concentration and reduce stress",
    description: [
      "By the end of this programme you will have experienced and practiced all of the key mindfulness meditations. You will have learned how to",
      "Develop your mental capacity, concentration, capability and focus",
      "Calm yourself in moments of anger, high stress and anxiety",
      "Develop ongoing resilience to stress and anxiety",
      "Deal calmly with stressful communications",
    ],
    thumbnail:
      "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/courseThumbnail/Fearless.webp",
    courseLength: "07",
    totalLecture: "15",
    price: "To be released",
    instructor: {
      _id: 10001,
      name: "Dr. Abul Kalam",
      image: "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/instructors/abulKalam.webp",
      designation: "Director of Training and founder of inMindSight",
      description: `For 10 years I have been studying life, energy, spirit, healing, Law of Attraction to understand why I am here, how the spiritual world works and how to make my life amazing.
      I am a compassionate and grounded Reiki Energy Healer offering beautiful souls like you spiritual guidance, wisdom, and the deep transformation you are seeking.`,
      courses: ["C001"],
    }
  },
  {
    courseID: "C007",
    title: "Welcome To Meditation",
    introduction:
      "Level 2: BLISSbowls™ Sound Healing Methods for Integrating a Bowl into Sessions!",
    description: [
      'NOTE: To get the most out of this training, you will need to watch the "Singing Bowl FUNdamentals" class to receive important foundational skills.',
      "Sound-crafting a complete BLISSbowls™ Sound Healing Session with just one bowl!",
      "How to integrate a metal or quartz crystal singing bowl into any Energy or Bodywork Healing modality.",
      "Providing new sound healing ideas for practitioners of all kinds, including energy workers, massage therapists, and bodyworkers.",
      "Develop health, inner wisdom, mindfulness and true happiness",
      "4 hours of BEA (brain enhancing audio) mp3 files to help harmonize the brain for easier meditation",
    ],
    thumbnail:
      "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/courseThumbnail/Welcome.webp",
    courseLength: "2.5",
    totalLecture: "6",
    price: "To be released",
    instructor: {
      _id: 10007,
      name: "Nazish Shameem Qazi",
      image: "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/instructors/nazish.webp",
      designation: "Sound Energy Practitioner, BLISSbowls™ Healing Methods",
      description:
        "Nazish S. Qazi combines a 23-year career in the healing arts with 40 years in the music business to manifest her passion for helping people through an innovative approach to singing bowls. She is a pioneer in the use of therapeutic techniques with singing bowls to help a modern society find transformation, stress-relief and pure presence.",
      courses: ["C007"],
    },
  },
  {
    courseID: "C005",
    title: "Power of Positive Thinking",
    introduction:
      "Retrain your brain to reduce stress and improve your focus and concentration.",
    description: [
      "Relax and relieve stress using a simple relaxation and meditation technique",
      "You will learn what mindfulness meditation is all about and how to practice it.",
      "Practice self-observation and meditation with compassion and clarity",
    ],
    thumbnail:
      "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/courseThumbnail/Power.webp",
    courseLength: "2.5",
    totalLecture: "10",
    price: "To be released",
    instructor: {
      _id: 10005,
      name: "D. Almasur Rahman",
      image: "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/instructors/almasur.webp",
      designation: "The Brain Lady",
      description:
        "My name is D. Almasur Rahman and I am the founder of peace inside me online retreats and I am super excited to be a part of the Udemy community and cultivate inner peace and balance through powerful meditative practices that me and my team collected from around the world to help you get in touch with yourself and find your happy place.",
      courses: ["C005"],
    },
  },
  {
    courseID: "C003",
    title: "Creative Meditation",
    introduction: "yoga for life",
    description: [
      "learn theory and practice of meditation and start benefiting from practice of mediation. And also teach others on how to mediatiate",
    ],
    thumbnail:
      "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/courseThumbnail/Creative.webp",
    courseLength: "07",
    totalLecture: "11",
    price: "To be released",
    instructor: {
      _id: 10003,
      name: "Dr. Abul Kalam",
      image: "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/instructors/abulKalam.webp",
      designation: "Health & Fitness Coach | Best Selling Instructor",
      description: `Im a certified coach and author. Over the years I've worked with and coached 100,000 students from all over the world. My expertise includes science-based personal development, health & fitness advice in the following areas:
      - Self Improvement
      - Life Coaching
      - Stress Management
      - Muscle Growth & Fat Loss
      - Healthy Living & Meal Planning
      - Gym Workouts & Bodybuilding`,
      courses: ["C003"],
    },
  },
  {
    courseID: "C004",
    title: "Self Healing in a Naural Way",
    introduction:
      "A simple, heart-centered relaxation and meditation you can do every day",
    description: [
      "Relax and relieve stress using a simple relaxation and meditation technique",
      "Connect mind and heart, naturally and gently",
      "Practice self-observation and meditation with compassion and clarity",
    ],
    thumbnail:
      "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/courseThumbnail/Self.webp",
    courseLength: "05",
    totalLecture: "05",
    price: "To be released",
    instructor: {
      _id: 10004,
      name: "Dr. Abul Kalam",
      image: "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/instructors/abulKalam.webp",
      designation: "Heartfulness Meditation Trainer",
      description: `I LOVE Ann's way of delivering the material. This course is full of little gems, with many surprising techniques to use with one bowl plus the resources are really usefull and add good value to the course! This was a good match for me. I am really looking forward for the next step (Part 3)! Blessings!`,
      courses: ["C004"],
    },
  },
  {
    courseID: "C006",
    title: "Anger and Stress Management",
    introduction:
      "Learn the art of meditation and mastery of the mind. Bring inner peace, focus and mindfulness into your life.",
    description: [
      "Learn to calm the mind and enter into a state of deep meditation and relaxation",
      "Several powerful mindfulness breathing techniques for meditation to cleanse and harmonize mind and body",
      "Recover and/ or prevent burn-out and stress through mindfulness meditation",
      "Meditations to realize that you create for a great part your own reality and how you can influence that",
      "Develop health, inner wisdom, mindfulness and true happiness",
      "4 hours of BEA (brain enhancing audio) mp3 files to help harmonize the brain for easier meditation",
    ],
    thumbnail:
      "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/courseThumbnail/Anger.webp",
    courseLength: "3",
    totalLecture: "10",
    price: "To be released",
    instructor: {
      _id: 10006,
      name: "D. Almasur Rahman",
      image: "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/instructors/almasur.webp",
      designation: "Founder & CEO, Meditation Magazine",
      description:
        "Hi, I'm Kevin! When I was in college, I was anxious and depressed. I was smoking a lot of weed, addicted to video games, taking a lot of psychedelics, waking up around 2pm every day. I was going out of my mind. Thankfully, a friend introduced me to meditation, and it gave me my life back.",
      courses: ["C006"],
    },
  },
  {
    courseID: "C002",
    title: "Money Mind Mastery",
    introduction:
      "Teach a group how to meditate in your workplace or community",
    description: [
      "আপনার জীবনকে পুনরায় গড়ে তুলুন সাইকোলজি এবং স্পিরিচুয়ালিটির মাধ্যমে",
      `Money Mind Mastery কোর্সে কারা জয়েন করতে পারবেন?
      – ১৩ বছর বা তার ঊর্ধ্বে কোনো বয়সের নারী এবং পুরুষ (উভয়)
      – দেশ বা দেশের বাইরের যেকোন প্রান্ত থেকে
      – যারা স্পিরিচুয়ালিটির, সাইকোলজি এবং ইসলামিক দর্শনের সংমিশ্রণে নিজের জীবনকে আরও সুন্দর করে গড়ে তুলতে চান। কোর্সটি তাদেরকে ভীষণভাবে উপকৃত করবে।`,
      `এই কোর্স থেকে যা শিখবেন-

      স্পিরিচুয়ালিটি, এবং এটি কিভাবে জীবন আরও সুন্দর করে গড়ে তুলতে পারে
      স্পিরিচুয়ালিটির মাধ্যমে ট্রমা থেকে মুক্তিলাভ
      শূন্যতা কাটিয়ে ওঠা
      আত্ম-নিয়ন্ত্রণ এবং সেলফ-ওয়ার্থ বৃদ্ধি
      কৃতজ্ঞতার অনুশীলন
      বাবা-মায়ের সাথে সুন্দর সম্পর্ক গঠন
      স্বামী/স্ত্রীর সাথে সুন্দর সম্পর্ক গঠন
      সন্তানের সাথে সুন্দর সম্পর্ক গঠন
      মন-মানসিকতার পরিশুদ্ধতা
      হিংসা থেকে মুক্তিলাভ
      ক্ষোভ ও রাগ দমন করা
      নিজের প্রতি ভালোবাসা বৃদ্ধি ও নিজের দায়িত্ব নেয়া
      নৈতিকতা ও স্পিরিচুয়ালিটির মাধ্যমে চরিত্র গঠন`,
      "Join a community of other meditation leaders around the world",
    ],
    thumbnail:
      "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/courseThumbnail/Money.webp",
    courseLength: "07",
    totalLecture: "14",
    price: "To be released",
    instructor: {
      _id: 10002,
      name: "Dr. Abul Kalam",
      image: "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/instructors/abulKalam.webp",
      designation: "Psychologist",
      description:
        "Dr. Abul Kalam is a Psychologist.",
      courses: ["C002"],
    },
  },
  
];

module.exports = {
  coursesData: coursesData,
};
