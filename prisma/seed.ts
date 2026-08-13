import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const SELECTED_UFS = ['SP', 'RJ', 'MG', 'RS', 'PR'];
const CITIES_PER_STATE = 5;

const IBGE_BASE = 'https://servicodados.ibge.gov.br/api/v1/localidades';

type IbgeRegiao = { id: number; sigla: string; nome: string };

type IbgeUF = {
  id: number;
  sigla: string;
  nome: string;
  regiao: IbgeRegiao;
};

type IbgeState = IbgeUF;

type IbgeCity = {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: IbgeUF;
    };
  };
  'regiao-imediata': {
    id: number;
    nome: string;
    'regiao-intermediaria': {
      id: number;
      nome: string;
      UF: IbgeUF;
    };
  };
};

async function fetchStates(): Promise<IbgeState[]> {
  const res = await fetch(`${IBGE_BASE}/estados`);
  if (!res.ok) throw new Error(`IBGE /estados failed: ${res.status}`);
  const all = (await res.json()) as IbgeState[];
  return all.filter((s) => SELECTED_UFS.includes(s.sigla));
}

async function fetchCities(uf: string): Promise<IbgeCity[]> {
  const res = await fetch(`${IBGE_BASE}/estados/${uf}/municipios`);
  if (!res.ok) throw new Error(`IBGE /municipios ${uf} failed: ${res.status}`);
  const all = (await res.json()) as IbgeCity[];
  return all.slice(0, CITIES_PER_STATE);
}

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    const states = await fetchStates();
    console.log(`Fetched ${states.length} states from IBGE`);

    for (const s of states) {
      const existingState = await prisma.state.findFirst({
        where: { stateCode: s.sigla, deletedAt: null },
      });

      const state =
        existingState ??
        (await prisma.state.create({
          data: { name: s.nome, stateCode: s.sigla },
        }));

      const cities = await fetchCities(s.sigla);

      for (const c of cities) {
        const existingCity = await prisma.city.findFirst({
          where: { name: c.nome, stateId: state.id, deletedAt: null },
        });

        if (existingCity) continue;

        await prisma.city.create({
          data: { name: c.nome, stateId: state.id },
        });
      }

      console.log(`  ${s.nome} (${s.sigla}): ${cities.length} cities`);
    }

    console.log('Seed completed.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
