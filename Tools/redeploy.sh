#to temp
cd temp
#Clone the repo
git clone https://github.com/jarekmachaj/iot-gateway.git
cd iot-gateway
git pull
git checkout master
git reset --hard origin/master
npm install
#Stop all processes
sudo forever stopall

#Move back and prepare to rename the Git Repo
cd ..
cd ..
rm -r -f iot-gateway/
mkdir iot-gateway
cp -r  temp/iot-gateway ./

#start the app
cd iot-gateway
mv config/MyZeroRaspberry.json config/config.json
forever -w ./bin/www
