const pm2 = require('pm2');

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  pm2.list((err, processes) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(processes)

    if (processes.length === 0) {
      console.log(`Nessun processo in esecuzione.`);
      pm2.disconnect();
      return;
    }

    processes.forEach((proc) => {
      console.log(`Fermo il processo ${proc.name} (ID: ${proc.pm_id}).`);
      pm2.stop(proc.pm_id);
    });

    pm2.disconnect();
  });
});
