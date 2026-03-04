exports.seed = async function(knex) {
  // Clean existing data
  await knex('video_progress').del();
  await knex('videos').del();
  await knex('sections').del();
  await knex('subjects').del();

  // Insert sample subject
  const [subjectId] = await knex('subjects').insert({
    title: 'Introduction to Web Development',
    slug: 'intro-web-dev',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
    is_published: true
  });

  // Insert sections
  const [section1Id] = await knex('sections').insert({
    subject_id: subjectId,
    title: 'HTML Fundamentals',
    order_index: 0
  });

  const [section2Id] = await knex('sections').insert({
    subject_id: subjectId,
    title: 'CSS Basics',
    order_index: 1
  });

  const [section3Id] = await knex('sections').insert({
    subject_id: subjectId,
    title: 'JavaScript Introduction',
    order_index: 2
  });

  // Insert videos for Section 1: HTML Fundamentals
  await knex('videos').insert([
    {
      section_id: section1Id,
      title: 'What is HTML?',
      description: 'Introduction to HTML and its role in web development.',
      youtube_url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
      order_index: 0,
      duration_seconds: 600
    },
    {
      section_id: section1Id,
      title: 'HTML Document Structure',
      description: 'Learn about DOCTYPE, html, head, and body tags.',
      youtube_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
      order_index: 1,
      duration_seconds: 720
    },
    {
      section_id: section1Id,
      title: 'Common HTML Elements',
      description: 'Explore paragraphs, headings, lists, and links.',
      youtube_url: 'https://www.youtube.com/watch?v=ieTHC78giGQ',
      order_index: 2,
      duration_seconds: 900
    }
  ]);

  // Insert videos for Section 2: CSS Basics
  await knex('videos').insert([
    {
      section_id: section2Id,
      title: 'Introduction to CSS',
      description: 'What is CSS and how does it style web pages?',
      youtube_url: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
      order_index: 0,
      duration_seconds: 480
    },
    {
      section_id: section2Id,
      title: 'CSS Selectors',
      description: 'Learn about class, ID, and element selectors.',
      youtube_url: 'https://www.youtube.com/watch?v=l1mER1bV0N0',
      order_index: 1,
      duration_seconds: 650
    }
  ]);

  // Insert videos for Section 3: JavaScript Introduction
  await knex('videos').insert([
    {
      section_id: section3Id,
      title: 'What is JavaScript?',
      description: 'Introduction to JavaScript programming language.',
      youtube_url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
      order_index: 0,
      duration_seconds: 540
    },
    {
      section_id: section3Id,
      title: 'Variables and Data Types',
      description: 'Understanding variables, strings, numbers, and booleans.',
      youtube_url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
      order_index: 1,
      duration_seconds: 780
    }
  ]);

  // Insert another subject
  const [subject2Id] = await knex('subjects').insert({
    title: 'React.js Fundamentals',
    slug: 'react-fundamentals',
    description: 'Master the basics of React.js including components, props, and state.',
    is_published: true
  });

  const [section4Id] = await knex('sections').insert({
    subject_id: subject2Id,
    title: 'Getting Started with React',
    order_index: 0
  });

  await knex('videos').insert([
    {
      section_id: section4Id,
      title: 'Introduction to React',
      description: 'What is React and why use it?',
      youtube_url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
      order_index: 0,
      duration_seconds: 600
    },
    {
      section_id: section4Id,
      title: 'Components and Props',
      description: 'Building reusable components with props.',
      youtube_url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
      order_index: 1,
      duration_seconds: 840
    }
  ]);

  console.log('Sample data seeded successfully!');
};
