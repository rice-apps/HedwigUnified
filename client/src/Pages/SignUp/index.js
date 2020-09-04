import React from 'react'
import * as Yup from 'yup'
import styled from 'styled-components'
import { Formik, Form, Field } from 'formik'
import { gql, useMutation } from '@apollo/client'

const EditProfileDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  max-width: 100vw;
  height: 40vh;
`

const CREATE_USER = gql`
  mutation CreateUser($name: String, $phone: String) {
    userUpdateOne(record: { name: $name, phone: $phone }) {
      record {
        _id
        __typename
        name
        phone
      }
      recordId
    }
  }
`

const EditProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too short!')
    .max(40, 'Too long!')
    .required('Required'),
  phone: Yup.string().required('Required!')
})

const SignUp = () => {
  // Notice that we have to initialize ALL of fields with values. These
  // could come from props, but since we don't want to prefill this form,
  // we just use an empty string. If you don't do this, React will yell
  // at you.

  const [createUser, { error }] = useMutation(CREATE_USER)

  return (
    <div>
      <Formik
        initialValues={{ name: '', phone: '' }}
        onSubmit={values => createUser({ variables: values })}
        validationSchema={EditProfileSchema}
      >
        {({ errors, touched }) => (
          <Form>
            <EditProfileDiv>
              <Field name='name' placeholder='Name' />
              {errors.name && touched.name ? <div>{errors.name}</div> : null}

              <Field name='phone' type='tel' placeholder='Phone Number' />
              {errors.phone && touched.phone ? <div>{errors.phone}</div> : null}

              <button type='submit'>Submit</button>
            </EditProfileDiv>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignUp
