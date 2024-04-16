const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/fieldController");

router.get("/:sectorId", fieldController.getFieldsBySector);
router.post("/:sectorId", fieldController.createField);
router.delete("/:fieldId", fieldController.deleteField);

module.exports = router;
