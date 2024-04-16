const express = require("express");
const router = express.Router();
const sectorController = require("../controllers/sectorController");

router.get("/", sectorController.getAllSectors);
router.post("/", sectorController.createSector);
router.delete("/:id", sectorController.deleteSector);

module.exports = router;
