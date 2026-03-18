import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export interface Demographics {
  age: number;
  gender: string;
  vulnerable_flag: boolean;
}

export interface Household {
  household_id: string;
  country: string;
  region_camp: string;
  family_size: number;
  members: Demographics[];
  head_age: number;
  head_gender: string;
  vulnerability_type: string | null;
  needs_category: string;
}

let cachedData: Household[] | null = null;
const DATASET_CACHE_TIME = 60 * 60 * 1000; // 1 hour
let lastLoadTime = 0;

export const loadData = async (): Promise<Household[]> => {
  const now = Date.now();
  if (cachedData && (now - lastLoadTime < DATASET_CACHE_TIME)) {
    return cachedData;
  }

  const filePath = path.join(process.cwd(), 'public', 'data', 'sample_population.csv');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found at ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((row: any) => ({
          ...row,
          members: typeof row.members === 'string' ? JSON.parse(row.members) : row.members
        })) as Household[];
        
        cachedData = parsedData;
        lastLoadTime = now;
        resolve(parsedData);
      },
      error: (error: any) => reject(error)
    });
  });
};

export const getSummaryStats = async () => {
  const data = await loadData();
  
  const totalHouseholds = data.length;
  let totalPeople = 0;
  let children = 0;
  let elderly = 0;
  let females = 0;
  let vulnerable = 0;
  
  const countryTotals: Record<string, number> = {};
  
  for (const hh of data) {
    totalPeople += hh.family_size;
    countryTotals[hh.country] = (countryTotals[hh.country] || 0) + hh.family_size;
    
    for (const member of hh.members) {
      if (member.age < 18) children++;
      if (member.age >= 60) elderly++;
      if (member.gender === 'F') females++;
      if (member.vulnerable_flag) vulnerable++;
    }
  }

  return {
    totalHouseholds,
    totalPeople,
    demographics: {
      childrenPercent: totalPeople > 0 ? children / totalPeople : 0,
      elderlyPercent: totalPeople > 0 ? elderly / totalPeople : 0,
      femalePercent: totalPeople > 0 ? females / totalPeople : 0,
      vulnerablePercent: totalPeople > 0 ? vulnerable / totalPeople : 0,
      childrenCount: children,
      femaleCount: females
    },
    countries: countryTotals,
    lastUpdated: new Date().toISOString()
  };
};
