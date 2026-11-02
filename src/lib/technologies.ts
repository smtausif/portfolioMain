export const technologyCategories = [
  { title: "Languages", technologies: [
    { name: "JavaScript", logo: "/tech/javascript.svg" },
    { name: "TypeScript", logo: "/tech/typescript.svg" },
    { name: "Python", logo: "/tech/python.svg" },
    { name: "Java", logo: "/tech/java.svg" },
    { name: "SQL", logo: "/tech/sql.svg" },
  ] },
  { title: "Frontend", technologies: [
    { name: "React", logo: "/tech/react.svg" },
    { name: "Next.js", logo: "/tech/nextjs.svg" },
    { name: "HTML5", logo: "/tech/html5.svg" },
    { name: "CSS3", logo: "/tech/css3.svg" },
    { name: "Tailwind CSS", logo: "/tech/tailwindcss.svg" },
  ] },
  { title: "Backend", technologies: [
    { name: "Node.js", logo: "/tech/nodejs.svg" },
    { name: "Express.js", logo: "/tech/express.svg" },
    { name: "REST APIs", logo: "/tech/rest-api.svg" },
  ] },
  { title: "Databases", technologies: [
    { name: "PostgreSQL", logo: "/tech/postgresql.svg" },
    { name: "Supabase", logo: "/tech/supabase.svg" },
    { name: "H2", logo: "/tech/h2.svg" },
  ] },
  { title: "Cloud & Tools", technologies: [
    { name: "AWS", logo: "/tech/aws.svg" },
    { name: "Docker", logo: "/tech/docker.svg" },
    { name: "Git", logo: "/tech/git.svg" },
    { name: "GitHub", logo: "/tech/github.svg" },
    { name: "VS Code", logo: "/tech/vscode.svg" },
  ] },
];

export const technologies = technologyCategories.flatMap(category => category.technologies);
