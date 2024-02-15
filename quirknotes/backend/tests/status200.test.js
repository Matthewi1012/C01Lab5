test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
  });

const SERVER_URL = "http://localhost:4000";
const {MongoClient, ObjectId} = require('mongodb');

describe('notes', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost:27017");
    db = await connection.db("quirknotes");
  });

  afterAll(async () => {
    await connection.close();
  });

  test("/postNote - Post a note", async () => {
    const title = "NoteTitleTest";
    const content = "NoteTitleContent";
  
    const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });
  
    const postNoteBody = await postNoteRes.json();
  
    expect(postNoteRes.status).toBe(200);
    expect(postNoteBody.response).toBe("Note added succesfully.");
  });

  test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
    const notes = db.collection("notes");
    await notes.deleteMany({});

    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    });

    const getAllNotesBody = await getAllNotesRes.json();

    expect(getAllNotesRes.status).toBe(200);
    expect(getAllNotesBody.response).toEqual([]);
  });

  test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
    const notes = db.collection("notes");
    await notes.deleteMany({});
    const mockNote1 = { _id: new ObjectId, title : "Note 1", content : "Note 1 Content"};
    const mockNote2 = {_id: new ObjectId, title: "Note 2",content : "Note 2 Content"}
    await notes.insertOne(mockNote1)
    await notes.insertOne(mockNote2)

    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    });

    const getAllNotesBody = await getAllNotesRes.json();

    expect(getAllNotesRes.status).toBe(200);
    expect(getAllNotesBody.response.length).toEqual(2);
  });

  test("/deleteNote - Delete a note", async () => {
    const notes = db.collection("notes");
    await notes.deleteMany({});
    const mockNote1 = { _id: new ObjectId, title : "Note 1", content : "Note 1 Content"};
    await notes.insertOne(mockNote1)

    const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${mockNote1._id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      }
    });

    const deleteNoteBody = await deleteNoteRes.json();

    expect(deleteNoteRes.status).toBe(200);
    expect(deleteNoteBody.response).toEqual(`Document with ID ${mockNote1._id} deleted.`)
  });

  test("/patchNote - Patch with content and title", async () => {
    const notes = db.collection("notes");
    await notes.deleteMany({});
    const mockNote1 = { _id: new ObjectId, title : "Note 1", content : "Note 1 Content"};
    await notes.insertOne(mockNote1)

    const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${mockNote1._id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New Note 1 Title",
        content: "New Note 1 Content"
      })
    });

    const patchNoteBody = await patchNoteRes.json();

    expect(patchNoteRes.status).toBe(200);
    expect(patchNoteBody.response).toBe(`Document with ID ${mockNote1._id} patched.`)
  });

  test("/patchNote - Patch with just title", async () => {
    const notes = db.collection("notes");
    await notes.deleteMany({});
    const mockNote1 = { _id: new ObjectId, title : "Note 1", content : "Note 1 Content"};
    await notes.insertOne(mockNote1)

    const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${mockNote1._id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New Note 1 Title"
      })
    });

    const patchNoteBody = await patchNoteRes.json();

    expect(patchNoteRes.status).toBe(200);
    expect(patchNoteBody.response).toBe(`Document with ID ${mockNote1._id} patched.`)
  });

  test("/patchNote - Patch with just content", async () => {
    const notes = db.collection("notes");
    await notes.deleteMany({});
    const mockNote1 = { _id: new ObjectId, title : "Note 1", content : "Note 1 Content"};
    await notes.insertOne(mockNote1)

    const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${mockNote1._id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "New Note 1 Content"
      })
    });

    const patchNoteBody = await patchNoteRes.json();

    expect(patchNoteRes.status).toBe(200);
    expect(patchNoteBody.response).toBe(`Document with ID ${mockNote1._id} patched.`)
  });

  test("/deleteAllNotes - Delete one note", async () => {
    const notes = db.collection("notes");
    await notes.deleteMany({});
    const mockNote1 = {_id: new ObjectId, title: "Note 1", content: "Note 1 Content"};
    await notes.insertOne(mockNote1)

    const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
      method: "DELETE",
      headers: {
       "Content-Type": "application/json",
      }
    })

    const deleteAllNotesBody = await deleteAllNotesRes.json();

    expect(deleteAllNotesRes.status).toBe(200);
    expect(deleteAllNotesBody.response).toBe(`1 note(s) deleted.`)
  });

  test("/deleteAllNotes - Delete three notes", async () => {
    const notes = db.collection("notes");
    await notes.deleteMany({});
    const mockNote1 = {_id: new ObjectId, title: "Note 1", content: "Note 1 Content"};
    const mockNote2 = {_id: new ObjectId, title: "Note 2", content: "Note 2 Content"};
    const mockNote3 = {_id: new ObjectId, title: "Note 3", content: "Note 3 Content"};
    await notes.insertOne(mockNote1)
    await notes.insertOne(mockNote2)
    await notes.insertOne(mockNote3)

    const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
      method: "DELETE",
      headers: {
       "Content-Type": "application/json",
      }
    })

    const deleteAllNotesBody = await deleteAllNotesRes.json();

    expect(deleteAllNotesRes.status).toBe(200);
    expect(deleteAllNotesBody.response).toBe(`3 note(s) deleted.`)
  });

  test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
    const notes = db.collection("notes");
    await notes.deleteMany({});
    const mockNote1 = {_id: new ObjectId, title: "Note 1", content: "Note 1 Content"};

    const updateNoteColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${mockNote1._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "color": "#FF0000"
      })
    })

    const updateNoteColorBody = await updateNoteColorRes.json();

    expect(updateNoteColorRes.status).toBe(200);
    expect(updateNoteColorBody.message).toBe('Note color updated successfully.');
  });

});