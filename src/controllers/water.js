import { WaterCollection } from '../db/models/water.js';

// юзер додає запис про воду
export const addWaterController = async (req, res) => {
  try {
    const { volume, date } = req.body;
    // const userId = req.user.id;
    //   заглушка
    const userId = '67a1f599b7ed372da1c632e0';

    if (volume < 50 || volume > 5000) {
      return res
        .status(400)
        .json({ message: 'The volume of water should be from 50 to 5000 ml' });
    }

    const newWater = new WaterCollection({ volume, date, userId });
    await newWater.save();

    res.status(201).json(newWater);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// юзєр редагує запис про воду
export const updateWaterController = async (req, res) => {
  try {
    const { id } = req.params;
    const { volume, date } = req.body;
    const userId = req.user.id;

    if (volume < 50 || volume > 5000) {
      return res
        .status(400)
        .json({ message: 'The volume of water should be from 50 to 5000 ml' });
    }

    const updatedWater = await WaterCollection.findOneAndUpdate(
      { _id: id, userId },
      { volume, date },
      { new: true },
    );

    if (!updatedWater) {
      return res.status(404).json({ message: 'No record found' });
    }

    res.json(updatedWater);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// юзер видаляє запис про воду
export const deleteWaterController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedWater = await WaterCollection.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedWater) {
      return res.status(404).json({ message: 'No record found' });
    }

    res.status(200).json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// отримує дані споживання за конкретний день
export const getDailyWaterController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const waterEntries = await WaterCollection.find({
      userId,
      date: { $gte: start, $lt: end },
    }).sort({ date: -1 });

    res.json(waterEntries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// отримує дані споживання за конкретний місяць
export const getMonthlyWaterController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.query;

    const start = new Date(month);
    start.setDate(1);
    const end = new Date(month);
    end.setMonth(end.getMonth() + 1);
    end.setDate(1);

    const waterEntries = await WaterCollection.find({
      userId,
      date: { $gte: start, $lt: end },
    }).sort({ date: -1 });

    res.json(waterEntries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
