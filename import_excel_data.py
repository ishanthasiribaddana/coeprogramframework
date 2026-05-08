import pandas as pd
import mysql.connector
from mysql.connector import Error

# Database connection config
DB_CONFIG = {
    'host': '144.91.123.164',
    'port': 3306,
    'user': 'root',
    'password': 'SH3iA7b9kUpd',
    'database': 'coe_program_framework'
}

# Excel file path
EXCEL_FILE = r'd:\Winsurf\OAPF\STEAMFrameWork\COE Program schedule-v2.xlsx'

# Sheet name to center_id mapping (based on database)
SHEET_TO_CENTER = {
    'AI': 1,
    'STEAM HUB': 2,
    'Language': 3,
    'Auditorium': 4,
    'Science ': 5,
    'Entrepreneurship': 6,
    'Media ': 7,
    'Mathamatic ': 8,
    'Fine Art ': 9,
    'Performing Art ': 10
}

# Program type mapping
PROGRAM_TYPES = {
    'Advance Programs': 1,  # ADVANCED
    'STEAM Programs': 2,    # STEAM
    'Cross Center Programs': 3  # CROSS_CENTER
}

def parse_duration(duration_str):
    """Parse duration string like '100-140' or '15–20' into min and max hours"""
    if pd.isna(duration_str) or not duration_str:
        return None, None
    
    # Handle different dash types
    duration_str = str(duration_str).replace('–', '-').replace('—', '-')
    
    # Remove any non-numeric characters except dash
    if '/' in duration_str:
        duration_str = duration_str.split('/')[0]
    
    parts = duration_str.split('-')
    if len(parts) == 2:
        try:
            min_hours = int(float(parts[0].strip()))
            max_hours = int(float(parts[1].strip()))
            return min_hours, max_hours
        except:
            return None, None
    elif len(parts) == 1:
        try:
            hours = int(float(parts[0].strip()))
            return hours, hours
        except:
            return None, None
    return None, None

def parse_sheet(df, center_id):
    """Parse a single sheet and extract programs"""
    programs = []
    current_type = None
    
    for idx, row in df.iterrows():
        first_col = row.iloc[0] if not pd.isna(row.iloc[0]) else None
        module_name = row.iloc[1] if len(row) > 1 and not pd.isna(row.iloc[1]) else None
        cross_center = row.iloc[2] if len(row) > 2 and not pd.isna(row.iloc[2]) else None
        duration = row.iloc[3] if len(row) > 3 and not pd.isna(row.iloc[3]) else None
        partnerships = row.iloc[4] if len(row) > 4 and not pd.isna(row.iloc[4]) else None
        career_guidance = row.iloc[5] if len(row) > 5 and not pd.isna(row.iloc[5]) else None
        associations = row.iloc[6] if len(row) > 6 and not pd.isna(row.iloc[6]) else None
        
        # Check if this row defines a program type
        if first_col in PROGRAM_TYPES:
            current_type = PROGRAM_TYPES[first_col]
            # If module_name is also present on this row, it's a program
            if module_name:
                min_hours, max_hours = parse_duration(duration)
                programs.append({
                    'center_id': center_id,
                    'program_type_id': current_type,
                    'module_name': str(module_name).strip(),
                    'duration_min_hours': min_hours,
                    'duration_max_hours': max_hours,
                    'partnerships': str(partnerships).strip() if partnerships else None,
                    'career_guidance': str(career_guidance).strip() if career_guidance else None,
                    'associations': str(associations).strip() if associations else None,
                    'cross_center': str(cross_center).strip() if cross_center else None,
                    'status': 'approved'
                })
        elif module_name and current_type:
            # This is a program row
            if str(module_name).strip().upper() == 'NOTES:' or str(module_name).strip() == '':
                continue
            min_hours, max_hours = parse_duration(duration)
            programs.append({
                'center_id': center_id,
                'program_type_id': current_type,
                'module_name': str(module_name).strip(),
                'duration_min_hours': min_hours,
                'duration_max_hours': max_hours,
                'partnerships': str(partnerships).strip() if partnerships else None,
                'career_guidance': str(career_guidance).strip() if career_guidance else None,
                'associations': str(associations).strip() if associations else None,
                'cross_center': str(cross_center).strip() if cross_center else None,
                'status': 'approved'
            })
    
    return programs

def insert_programs(connection, programs):
    """Insert programs into database"""
    cursor = connection.cursor()
    inserted = 0
    
    for prog in programs:
        try:
            # Build description from partnerships and career guidance
            desc_parts = []
            if prog['partnerships']:
                desc_parts.append(f"Partnerships: {prog['partnerships']}")
            if prog['career_guidance']:
                desc_parts.append(f"Career Guidance: {prog['career_guidance']}")
            description = ', '.join(desc_parts) if desc_parts else None
            
            # Insert program
            sql = """
                INSERT INTO programs 
                (center_id, program_type_id, module_name, description, 
                 duration_min_hours, duration_max_hours, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                prog['center_id'],
                prog['program_type_id'],
                prog['module_name'],
                description,
                prog['duration_min_hours'],
                prog['duration_max_hours'],
                prog['status']
            )
            
            cursor.execute(sql, values)
            program_id = cursor.lastrowid
            inserted += 1
            print(f"  Inserted: {prog['module_name']} (ID: {program_id})")
            
            # Handle cross-center request if applicable
            if prog['cross_center'] and prog['program_type_id'] == 3:
                # Map cross center name to center_id
                cross_center_map = {
                    'Mathematics Centre': 8,
                    'Fine Arts Centre': 9,
                    'Language Centre': 3,
                    'Auditorium': 4,
                    'Entrepreneurship Centre': 6,
                    'Media Centre': 7,
                    'Medical Centre': None,  # Not in database
                    'STEAM Hub': 2,
                    'Science Centre': 5,
                    'AI Centre': 1,
                    'Performing Arts Centre': 10
                }
                requesting_center_id = cross_center_map.get(prog['cross_center'])
                if requesting_center_id:
                    cursor.execute(
                        "INSERT INTO cross_center_requests (program_id, requesting_center_id) VALUES (%s, %s)",
                        (program_id, requesting_center_id)
                    )
                    
        except Error as e:
            print(f"  Error inserting {prog['module_name']}: {e}")
    
    connection.commit()
    return inserted

def main():
    # Connect to database
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        print("Connected to database successfully")
    except Error as e:
        print(f"Error connecting to database: {e}")
        return
    
    # Clear existing programs (optional - comment out if you want to keep existing data)
    cursor = connection.cursor()
    cursor.execute("DELETE FROM cross_center_requests")
    cursor.execute("DELETE FROM program_associations")
    cursor.execute("DELETE FROM program_placements")
    cursor.execute("DELETE FROM program_partners")
    cursor.execute("DELETE FROM programs")
    connection.commit()
    print("Cleared existing program data")
    
    # Read Excel file
    excel_data = pd.read_excel(EXCEL_FILE, sheet_name=None)
    
    total_inserted = 0
    
    # Process each sheet
    for sheet_name, center_id in SHEET_TO_CENTER.items():
        if sheet_name in excel_data:
            print(f"\nProcessing sheet: {sheet_name} (Center ID: {center_id})")
            df = excel_data[sheet_name]
            programs = parse_sheet(df, center_id)
            print(f"  Found {len(programs)} programs")
            
            if programs:
                inserted = insert_programs(connection, programs)
                total_inserted += inserted
        else:
            print(f"Sheet '{sheet_name}' not found in Excel file")
    
    print(f"\n=== Import Complete ===")
    print(f"Total programs inserted: {total_inserted}")
    
    connection.close()

if __name__ == '__main__':
    main()
