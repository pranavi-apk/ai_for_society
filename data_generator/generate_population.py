import pandas as pd
import numpy as np
import json
import random
import uuid
import os

# Configurations
np.random.seed(42)
random.seed(42)

REGIONAL_TOTALS = {
    "Bangladesh": {"total": 1182800, "camps": ["Kutupalong", "Bhasan Char", "Nayapara", "Camp 24", "Camp 26"]},
    "Malaysia": {"total": 194100, "camps": ["Klang Valley", "Penang", "Johor"]},
    "Thailand": {"total": 136300, "camps": ["Mae La", "Umpiem Mai", "Nu Po", "Mae Ra Ma Luang"]},
    "India": {"total": 86000, "camps": ["New Delhi", "Jammu", "Hyderabad"]},
    "Indonesia": {"total": 2700, "camps": ["Aceh", "Medan", "Jakarta"]},
    "Myanmar": {"total": 3727200, "camps": ["Rakhine IDP Camps", "Kachin Shelters", "Shan Region", "Sagaing"]},
    "Cambodia": {"total": 141850, "camps": ["Border Area 1", "Border Area 2", "Transit Center"]}
}

TOTAL_POPULATION = sum(v["total"] for v in REGIONAL_TOTALS.values())
TARGET_POPULATION = 500000  # Generate 500k individuals for 'full' dataset for performance
SCALE_FACTOR = TARGET_POPULATION / TOTAL_POPULATION

NEEDS_CATEGORIES = ["shelter", "food", "medical", "protection", "education", "wash", "livelihood"]

def generate_age():
    r = random.random()
    if r < 0.35:
        return random.randint(0, 17)
    elif r < 0.43:
        return random.randint(60, 90)
    else:
        return random.randint(18, 59)

def generate_gender(age):
    # Roughly 50-50, but maybe slightly more females in adult bracket (common in refugee stats)
    if 18 <= age <= 59:
        return "F" if random.random() < 0.55 else "M"
    return "F" if random.random() < 0.50 else "M"

def generate_vulnerability(age):
    base_prob = 0.15
    if age >= 60 or age <= 5:
        base_prob = 0.30
    
    is_vuln = random.random() < base_prob
    vuln_type = None
    
    if is_vuln:
        if age <= 17:
            vuln_type = random.choice(["unaccompanied_minor", "malnutrition", "child_labor_risk"])
        elif age >= 60:
            vuln_type = random.choice(["elderly_at_risk", "chronic_illness", "disabled"])
        else:
            vuln_type = random.choice(["single_parent", "disabled", "chronic_illness", "gbv_survivor", "pregnant_lactating"])
            
    return is_vuln, vuln_type

def generate_population():
    households = []
    hh_counter = 1
    
    for country, data in REGIONAL_TOTALS.items():
        target_country_pop = int(data["total"] * SCALE_FACTOR)
        current_pop = 0
        
        while current_pop < target_country_pop:
            # Average household size 4-5
            hh_size = random.choices([1, 2, 3, 4, 5, 6, 7, 8], weights=[0.05, 0.1, 0.15, 0.25, 0.25, 0.1, 0.05, 0.05])[0]
            
            # Prevent going too far over target
            if current_pop + hh_size > target_country_pop and current_pop > target_country_pop * 0.99:
                hh_size = target_country_pop - current_pop
                if hh_size <= 0: break
                
            members = []
            head_age = 0
            head_gender = ""
            hh_vulnerabilities = []
            
            for i in range(hh_size):
                age = generate_age()
                gender = generate_gender(age)
                is_vuln, vuln_type = generate_vulnerability(age)
                
                members.append({
                    "age": age,
                    "gender": gender,
                    "vulnerable_flag": is_vuln
                })
                
                if vuln_type:
                    hh_vulnerabilities.append(vuln_type)
                    
                # Identify head of household (oldest adult, or oldest child if no adults)
                if i == 0 or (age > head_age and age >= 18) or (head_age < 18 and age > head_age):
                    head_age = age
                    head_gender = gender
                    
            primary_vuln = hh_vulnerabilities[0] if hh_vulnerabilities else None
            needs_count = random.randint(1, 4)
            hh_needs = random.sample(NEEDS_CATEGORIES, needs_count)
            
            households.append({
                "household_id": f"{country[:3].upper()}-{hh_counter:07d}",
                "country": country,
                "region_camp": random.choice(data["camps"]),
                "family_size": hh_size,
                "members": json.dumps(members),
                "head_age": head_age,
                "head_gender": head_gender,
                "vulnerability_type": primary_vuln,
                "needs_category": ",".join(hh_needs)
            })
            
            hh_counter += 1
            current_pop += hh_size

    df = pd.DataFrame(households)
    return df

if __name__ == "__main__":
    print("Generating full population dataset (~500k individuals)...")
    df_full = generate_population()
    
    output_dir = os.path.dirname(os.path.abspath(__file__))
    full_path = os.path.join(output_dir, "full_population.csv")
    df_full.to_csv(full_path, index=False)
    print(f"Saved full dataset: {len(df_full)} households to {full_path}")
    
    print("Generating sample population dataset (50,000 households)...")
    # Sample 50,000 households for the demo
    df_sample = df_full.sample(n=min(50000, len(df_full)), random_state=42)
    sample_path = os.path.join(output_dir, "sample_population.csv")
    df_sample.to_csv(sample_path, index=False)
    print(f"Saved sample dataset: {len(df_sample)} households to {sample_path}")
    
    # Calculate and print stats to ensure matching requirements
    print("\n--- Demographics Check ---")
    all_members = []
    for m_json in df_sample['members']:
        all_members.extend(json.loads(m_json))
        
    total_people = len(all_members)
    children = sum(1 for m in all_members if m['age'] < 18)
    elderly = sum(1 for m in all_members if m['age'] >= 60)
    female = sum(1 for m in all_members if m['gender'] == 'F')
    vulnerable = sum(1 for m in all_members if m['vulnerable_flag'])
    
    print(f"Total people in sample: {total_people}")
    print(f"Children (<18): {children/total_people:.1%} (Target: 30-35%)")
    print(f"Elderly (60+): {elderly/total_people:.1%} (Target: 5-8%)")
    print(f"Female: {female/total_people:.1%} (Target: ~50%)")
    print(f"Vulnerable: {vulnerable/total_people:.1%} (Target: 12-15%)")
