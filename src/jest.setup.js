import db from "./libs/prisma.js";

const clearTestData = async () => {
  await db.Curriculum.deleteMany();
  await db.JobApplication.deleteMany();
  await db.JobOpportunity.deleteMany();
  await db.UserProfile.deleteMany();
  await db.CompanyProfile.deleteMany();
};

const createTestData = async () => {
  const user = await db.userProfile.create({
    data: {
      name: "Felps",
      email: "aaawww@example.com",
      password: "SenhaSegura123",
      age: 29,
      profilePhotoReference: "",
      description:
        "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
      fieldOfWork: "Desenvolvimento de Software",
      technologies: {
        JavaScript: true,
        Python: true,
        Java: false,
        CSharp: false,
        React: true,
        NodeJs: true,
        Ruby: false,
        PHP: false,
      },
    },
  });

  const user2 = await db.userProfile.create({
    data: {
      name: "Felps",
      email: "bbbwww@example.com",
      password: "SenhaSegura123",
      age: 29,
      profilePhotoReference: "",
      description:
        "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
      fieldOfWork: "Desenvolvimento de Software",
      technologies: {
        JavaScript: true,
        Python: true,
        Java: false,
        CSharp: false,
        React: true,
        NodeJs: true,
        Ruby: false,
        PHP: false,
      },
    },
  });

  global.testUserId = user.id;
  global.testUser2Id = user2.id;

  const company = await db.CompanyProfile.create({
    data: {
      name: "Koko",
      description:
        "Empresa especializada em desenvolvimento de software muito avançados e legais ebaaaaaaaaaaaaaaaaaaaaaaaaa.",
      CNPJ: "20.332.678/0001-99",
      password: "senhaSegura1234",
      foundation: "2001-06-15",
    },
  });

  global.testCompanyId = company.id;
  global.testCompanyName = company.name;

  await db.Curriculum.create({
    data: {
      userId: global.testUserId,
      description:
        "decriçãodecriçãodecriçãodecriçãodecriçãodecriçãodecriçãodecriçãodecrição",
      details:
        "DetalhesDetalhesDetalhesDetalhesDetalhesDetalhesDetalhesDetalhesDetalhesDetalhes",
    },
  });

  const job = await db.JobOpportunity.create({
    data: {
      companyId: global.testCompanyId,
      companyName: global.testCompanyName,
      description:
        "Descrição exemplo 2 muuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuito legal",
      details:
        "Detalhes exemplo muuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuito legais",
      jobType: "CLT",
    },
  });

  const jobId = job.id;

  await db.JobApplication.create({
    data: {
      userId: global.testUserId,
      jobId,
    },
  });
};

beforeAll(async () => {
  await clearTestData();
});

beforeEach(async () => {
  await createTestData();
});

afterEach(async () => {
  await clearTestData();
});
