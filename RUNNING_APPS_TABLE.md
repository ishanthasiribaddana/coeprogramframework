# Running Apps on Servers

| # | IP | App Name | Domain | Server Access Method | Local Project Location |
|---|-----|----------|---------|---------------------|----------------------|
| 1 | 144.91.123.164 | COE Program Framework | https://coe-sedf.oapf.org/, http://144.91.123.164/coe/ | SSH Key (id_ed25519_temco) | f:\Winsurf\OAPF\coe-program-framework |
| 2 | 144.91.123.164 | Teacher Attendance System | - | SSH Key (id_ed25519_temco) | - |
| 3 | 144.91.123.164 | Recovery System | http://144.91.123.164/ | SSH Key (id_ed25519_temco) | - |
| 4 | 144.91.123.164 | Elibrary System | - | SSH Key (id_ed25519_temco) | - |
| 5 | 144.91.123.164 | Coop-logitec System | - | SSH Key (id_ed25519_temco) | - |
| 6 | 144.91.123.164 | Final Accounts Review | - | SSH Key (id_ed25519_temco) | - |
| 7 | 144.91.123.164 | Java/WildFly Systems | - | SSH Key (id_ed25519_temco) | - |
| 8 | 5.189.163.58 | Java/WildFly Systems (Server 2) | - | SSH Key (id_ed25519_temco) | - |
| 9 | 109.123.227.166 | TEMCO Bank Website | temcobank.com | SSH Key (id_rsa_temco) | F:\Exon\Projects\Temco-Web |
| 10 | 109.123.227.166 | EEPIP (MLM Module) | eepip.temcobank.com | SSH Key (id_rsa_temco) | F:\Exon\Java_Holdings_MLM |
| 11 | 109.123.227.166 | TEMCO Admin App | admin.temcobank.com | SSH Key (id_rsa_temco) | F:\TemcoERP\AdminApp |
| 12 | 109.123.227.166 | TEMCO Finance App | finance.temcobank.com | SSH Key (id_rsa_temco) | F:\TemcoERP\FinanceApp |
| 13 | 109.123.227.166 | TEMCO Customer Portal | my.temcobank.com | SSH Key (id_rsa_temco) | F:\TemcoERP\customer-portal |
| 14 | - | Java Institute System | web.javainstitute.org | - | F:\Exon\Java Institute System |
| 15 | 5.189.163.58 | Java Institute (JIHLTD) | https://staging.jihltd.com/admin/dashboard | SSH Key (id_ed25519_temco) | - |

**Notes:**
- Server 144.91.123.164: Contabo VPS (COE, Recovery, Education systems)
- Server 109.123.227.166: TEMCO production server (TEMCO Bank, EEPIP systems)
- Server 5.189.163.58: Secondary Java/WildFly server + JIHLTD staging
- Java Institute System: Local development only, not deployed to remote server
- SSH Keys:
  - id_ed25519_temco: C:\Users\User\.ssh\id_ed25519_temco (Ed25519)
  - id_rsa_temco: C:\Users\User\.ssh\id_rsa_temco (RSA 4096-bit)
