import Ticket from "../models/Ticket.js";

export const getTickets = async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id });
  res.json(tickets);
};

export const createTicket = async (req, res) => {
  const ticket = await Ticket.create({
    ...req.body,
    user: req.user.id,
  });

  res.json(ticket);
};
