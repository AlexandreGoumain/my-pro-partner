@echo off
REM ================================
REM Script de transfert vers le VPS
REM Pour Windows (PowerShell)
REM ================================

echo.
echo ========================================
echo  Transfer vers VPS OVH - My Pro Partner
echo ========================================
echo.

REM Vérifier que nous sommes dans le bon dossier
if not exist "package.json" (
    echo [ERREUR] Ce script doit etre execute depuis le dossier du projet !
    pause
    exit /b 1
)

echo [INFO] Preparation du transfert...
echo.

REM Demander l'IP du VPS
set /p VPS_IP="Entrez l'IP du VPS (par defaut: 51.91.111.112): " || set VPS_IP=51.91.111.112
set /p VPS_USER="Entrez l'utilisateur SSH (par defaut: root): " || set VPS_USER=root

echo.
echo [INFO] Configuration:
echo   - VPS: %VPS_USER%@%VPS_IP%
echo   - Dossier destination: ~/apps/my-pro-partner
echo.

pause

echo.
echo [INFO] Creation de l'archive...

REM Supprimer l'ancienne archive si elle existe
if exist "deploy.zip" del deploy.zip

REM Créer l'archive avec PowerShell (exclure node_modules, .next, .git)
powershell -Command "& {$exclude = @('node_modules', '.next', '.git', 'deploy.zip'); Get-ChildItem -Path . -Recurse | Where-Object { $skip = $false; foreach($ex in $exclude) { if($_.FullName -like \"*\$ex*\") { $skip = $true; break; } }; -not $skip } | Compress-Archive -DestinationPath deploy.zip -Force}"

if not exist "deploy.zip" (
    echo [ERREUR] Impossible de creer l'archive !
    pause
    exit /b 1
)

echo [OK] Archive creee: deploy.zip
echo.

REM Afficher la taille
for %%A in (deploy.zip) do echo [INFO] Taille: %%~zA bytes
echo.

echo [INFO] Methodes de transfert disponibles:
echo.
echo   1. SCP (recommande - rapide)
echo   2. WinSCP (interface graphique)
echo   3. Annuler
echo.

set /p METHOD="Choisissez une methode (1-3): "

if "%METHOD%"=="1" goto scp
if "%METHOD%"=="2" goto winscp
goto cancel

:scp
echo.
echo [INFO] Transfert via SCP...
echo.
echo [CMD] scp deploy.zip %VPS_USER%@%VPS_IP%:~/
echo.

REM Vérifier que scp est disponible
where scp >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] SCP n'est pas disponible sur votre systeme.
    echo.
    echo Installez OpenSSH Client:
    echo   1. Parametres Windows ^> Applications ^> Fonctionnalites facultatives
    echo   2. Ajouter une fonctionnalite
    echo   3. Chercher "OpenSSH Client" et installer
    echo.
    echo Ou utilisez WinSCP (option 2)
    pause
    exit /b 1
)

REM Transférer le fichier
scp deploy.zip %VPS_USER%@%VPS_IP%:~/

if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Echec du transfert SCP !
    pause
    exit /b 1
)

echo.
echo [OK] Transfert reussi !
echo.
echo Commandes a executer sur le VPS:
echo.
echo   ssh %VPS_USER%@%VPS_IP%
echo   mkdir -p ~/apps/my-pro-partner
echo   unzip -o ~/deploy.zip -d ~/apps/my-pro-partner
echo   cd ~/apps/my-pro-partner
echo   chmod +x deploy.sh
echo   ./deploy.sh prod
echo.
pause
goto end

:winscp
echo.
echo [INFO] Utilisation de WinSCP
echo.
echo 1. Telechargez WinSCP: https://winscp.net/
echo 2. Installez et ouvrez WinSCP
echo 3. Configurez la connexion:
echo    - Protocole: SFTP
echo    - Hote: %VPS_IP%
echo    - Utilisateur: %VPS_USER%
echo    - Port: 22
echo 4. Connectez-vous
echo 5. Uploadez le fichier deploy.zip dans le dossier /root/
echo.
echo Puis sur le VPS, executez:
echo   mkdir -p ~/apps/my-pro-partner
echo   unzip -o ~/deploy.zip -d ~/apps/my-pro-partner
echo   cd ~/apps/my-pro-partner
echo   chmod +x deploy.sh
echo   ./deploy.sh prod
echo.
pause
goto end

:cancel
echo [INFO] Operation annulee.
pause
goto end

:end
echo.
echo [INFO] Script termine.
exit /b 0
