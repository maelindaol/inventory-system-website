// tslint:disable-next-line:import-name
import dateformatplugin from '../src';
import mongoose, { Schema, Document } from 'mongoose';
import moment from 'moment';
import { MongoMemoryServer } from 'mongodb-memory-server';

interface IPerson extends Document {
  name: string;
  birthdate: Date;
  nestedObject?: IPerson;
  nestedArray?: IPerson[];
}

describe('mongoose-plugin-date-format', () => {
  let mongod;

  beforeAll(async () => {
    mongod = new MongoMemoryServer();

    const uri = await mongod.getUri();

    return mongoose.connect(uri, {
      useNewUrlParser: true,
    });
  });

  test('convert the date to a specific format', async () => {
    const personSchema = new Schema({ name: String, birthdate: Date });
    const dateFormat = 'YYYY';
    const birthdate = moment();
    personSchema.plugin(dateformatplugin(dateFormat));
    const personModel = mongoose.model<IPerson>('people', personSchema);

    const john = {
      birthdate,
      name: 'John Doe',
    };

    const person = await personModel.create(john);
    expect(person.get('birthdate')).toBeInstanceOf(Date);
    expect(person.toJSON().birthdate).toEqual(birthdate.format(dateFormat));
  });

  test('convert the date to a specific format with nested object', async () => {
    const personSchema = new Schema({
      name: String,
      birthdate: Date,
      nestedObject: {
        name: String,
        birthdate: Date,
      },
    });
    const dateFormat = 'YYYY';
    const birthdate = moment();
    personSchema.plugin(dateformatplugin(dateFormat));
    const personModel = mongoose.model<IPerson>('peopleNested', personSchema);

    const john = {
      birthdate,
      name: 'John Doe',
      nestedObject: {
        birthdate,
        name: 'Nested test',
      },
    };

    const person = await personModel.create(john);
    expect(person.get('birthdate')).toBeInstanceOf(Date);
    expect(person.toJSON().birthdate).toEqual(birthdate.format(dateFormat));
    expect(person.toJSON().nestedObject.birthdate).toEqual(birthdate.format(dateFormat));
  });

  test('convert the date to a specific format with nested array of object', async () => {
    const personSchema = new Schema({
      name: String,
      birthdate: Date,
      nestedArray: [{
        name: String,
        birthdate: Date,
      }],
    });
    const dateFormat = 'YYYY';
    const birthdate = moment();
    personSchema.plugin(dateformatplugin(dateFormat));
    const personModel = mongoose.model<IPerson>('peopleNestedArrayOfObjects', personSchema);

    const john = {
      birthdate,
      name: 'John Doe',
      nestedArray: [
        {
          birthdate,
          name: 'Nested test',
        },
        {
          birthdate,
          name: 'Nested test2',
        },
      ],
    };

    const person = await personModel.create(john);
    expect(person.get('birthdate')).toBeInstanceOf(Date);
    expect(person.toJSON().birthdate).toEqual(birthdate.format(dateFormat));
    expect(person.toJSON().nestedArray[0].birthdate).toEqual(birthdate.format(dateFormat));
    expect(person.toJSON().nestedArray[1].birthdate).toEqual(birthdate.format(dateFormat));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });
});
